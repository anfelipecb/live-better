'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Trash2, Check, Clock, Dumbbell } from 'lucide-react';

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, dispatch } = useApp();
  const router = useRouter();

  const workout = state.workouts.find((w) => w.id === id);

  const lookupExercise = (exId: string) =>
    state.exercises.find((e) => e.id === exId);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_WORKOUT', payload: id });
    router.push('/workouts');
  };

  const handleToggleCompleted = () => {
    if (!workout) return;
    dispatch({
      type: 'UPDATE_WORKOUT',
      payload: { ...workout, completed: !workout.completed },
    });
  };

  if (!workout) {
    return (
      <PageContainer>
        <GlassCard className="text-center py-16">
          <Dumbbell size={32} className="mx-auto mb-3 text-dark-500" />
          <h2 className="text-lg font-semibold text-dark-200 mb-2">
            Workout not found
          </h2>
          <p className="text-dark-400 mb-6">
            This workout may have been deleted or the link is invalid.
          </p>
          <Button variant="secondary" onClick={() => router.push('/workouts')}>
            Back to Workouts
          </Button>
        </GlassCard>
      </PageContainer>
    );
  }

  const formattedDate = new Date(
    workout.date + 'T12:00:00',
  ).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <PageContainer>
      <Header
        title={workout.title}
        subtitle={formattedDate}
        action={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={workout.completed ? 'secondary' : 'primary'}
              onClick={handleToggleCompleted}
            >
              <Check size={16} className="mr-1.5" />
              {workout.completed ? 'Completed' : 'Mark Complete'}
            </Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>
              <Trash2 size={16} className="mr-1.5" />
              Delete
            </Button>
          </div>
        }
      />

      {/* -- Summary card ------------------------------------------------- */}
      <GlassCard className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Badge variant={workout.category}>
            {workout.category.charAt(0).toUpperCase() +
              workout.category.slice(1)}
          </Badge>

          <div className="flex items-center gap-1.5 text-sm text-dark-300">
            <Clock size={14} />
            <span>{workout.durationMin} minutes</span>
          </div>

          {workout.category !== 'rest' && (
            <span className="text-sm text-dark-300">
              {workout.exercises.length}{' '}
              {workout.exercises.length === 1 ? 'exercise' : 'exercises'}
            </span>
          )}

          {workout.completed && (
            <Badge variant="success">Completed</Badge>
          )}
        </div>

        {workout.notes && (
          <p className="mt-4 text-dark-300 text-sm">{workout.notes}</p>
        )}
      </GlassCard>

      {/* -- Exercise details --------------------------------------------- */}
      {workout.exercises.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-dark-100">Exercises</h2>

          {workout.exercises.map((wEx, idx) => {
            const info = lookupExercise(wEx.exerciseId);
            return (
              <GlassCard key={idx}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-medium text-dark-100">
                    {info?.name ?? 'Unknown Exercise'}
                  </h3>
                  {info && (
                    <Badge variant="default">{info.muscleGroup}</Badge>
                  )}
                </div>

                {/* Strength sets table */}
                {workout.category === 'strength' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-dark-400 border-b border-dark-700">
                          <th className="text-left py-2 pr-4 font-medium">
                            Set
                          </th>
                          <th className="text-left py-2 pr-4 font-medium">
                            Reps
                          </th>
                          <th className="text-left py-2 font-medium">
                            Weight (kg)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {wEx.sets.map((set) => (
                          <tr
                            key={set.setNumber}
                            className="border-b border-dark-700/50"
                          >
                            <td className="py-2 pr-4 text-dark-300">
                              #{set.setNumber}
                            </td>
                            <td className="py-2 pr-4 text-dark-100">
                              {set.reps ?? '-'}
                            </td>
                            <td className="py-2 text-dark-100">
                              {set.weightKg ?? '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Cycling sets */}
                {workout.category === 'cycling' &&
                  wEx.sets.map((set) => (
                    <div
                      key={set.setNumber}
                      className="flex gap-6 text-sm py-2 border-b border-dark-700/50 last:border-0"
                    >
                      <span className="text-dark-400">
                        #{set.setNumber}
                      </span>
                      <span className="text-dark-100">
                        {set.durationMin ?? '-'} min
                      </span>
                      <span className="text-dark-100">
                        {set.distanceKm ?? '-'} km
                      </span>
                    </div>
                  ))}

                {/* Yoga sets */}
                {workout.category === 'yoga' &&
                  wEx.sets.map((set) => (
                    <div
                      key={set.setNumber}
                      className="flex gap-6 text-sm py-2 border-b border-dark-700/50 last:border-0"
                    >
                      <span className="text-dark-400">
                        #{set.setNumber}
                      </span>
                      <span className="text-dark-100">
                        {set.durationMin ?? '-'} min
                      </span>
                    </div>
                  ))}
              </GlassCard>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
