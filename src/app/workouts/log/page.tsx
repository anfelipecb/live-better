'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  WorkoutCategory,
  WorkoutExercise,
  ExerciseSet,
} from '@/types';
import { useApp } from '@/context/AppContext';
import { generateId, getToday } from '@/lib/utils';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ExercisePicker from '@/components/workouts/ExercisePicker';
import ExerciseSetRow from '@/components/workouts/ExerciseSetRow';
import { Plus, Trash2, X, Dumbbell } from 'lucide-react';

export default function LogWorkoutPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();

  const [date, setDate] = useState(getToday());
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('strength');
  const [durationMin, setDurationMin] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const selectedIds = exercises.map((e) => e.exerciseId);

  const handleAddExercise = useCallback(
    (exerciseId: string) => {
      setExercises((prev) => [
        ...prev,
        {
          exerciseId,
          sets: [{ setNumber: 1 }],
        },
      ]);
      setShowPicker(false);
    },
    [],
  );

  const handleRemoveExercise = useCallback((idx: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleAddSet = useCallback((exIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        return {
          ...ex,
          sets: [
            ...ex.sets,
            { setNumber: ex.sets.length + 1 },
          ],
        };
      }),
    );
  }, []);

  const handleUpdateSet = useCallback(
    (exIdx: number, setIdx: number, updatedSet: ExerciseSet) => {
      setExercises((prev) =>
        prev.map((ex, i) => {
          if (i !== exIdx) return ex;
          return {
            ...ex,
            sets: ex.sets.map((s, si) => (si === setIdx ? updatedSet : s)),
          };
        }),
      );
    },
    [],
  );

  const handleDeleteSet = useCallback((exIdx: number, setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        const newSets = ex.sets
          .filter((_, si) => si !== setIdx)
          .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...ex, sets: newSets };
      }),
    );
  }, []);

  const lookupExercise = (id: string) =>
    state.exercises.find((ex) => ex.id === id);

  const handleSave = () => {
    if (!title.trim() || !durationMin) return;

    dispatch({
      type: 'ADD_WORKOUT',
      payload: {
        id: generateId(),
        date,
        category,
        title: title.trim(),
        exercises: category === 'rest' ? [] : exercises,
        durationMin: Number(durationMin),
        notes: notes.trim() || undefined,
        completed: false,
      },
    });

    router.push('/workouts');
  };

  const categories: WorkoutCategory[] = [
    'strength',
    'cycling',
    'yoga',
    'rest',
  ];

  const isRest = category === 'rest';

  return (
    <PageContainer>
      <Header
        title="Log Workout"
        subtitle="Record your training session"
      />

      <div className="space-y-6 max-w-2xl">
        {/* -- Basic fields ------------------------------------------------ */}
        <GlassCard>
          <div className="space-y-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <Input
              label="Title"
              placeholder="e.g. Push Day, Morning Ride"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-200">
                Category
              </label>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      if (cat === 'rest') setExercises([]);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                      category === cat
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-dark-600 bg-dark-800 text-dark-300 hover:bg-white/5'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Duration (minutes)"
              type="number"
              min={1}
              placeholder="45"
              value={durationMin}
              onChange={(e) =>
                setDurationMin(e.target.value ? Number(e.target.value) : '')
              }
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-dark-200">
                Notes (optional)
              </label>
              <textarea
                className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 placeholder-dark-400 outline-none transition-colors resize-none"
                rows={3}
                placeholder="How did it feel? Anything to remember?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </GlassCard>

        {/* -- Exercises section ------------------------------------------- */}
        {!isRest && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-dark-100">
                Exercises
              </h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowPicker((p) => !p)}
              >
                <Plus size={16} className="mr-1.5" />
                Add Exercise
              </Button>
            </div>

            {showPicker && (
              <ExercisePicker
                category={category}
                selectedIds={selectedIds}
                onSelect={handleAddExercise}
              />
            )}

            {exercises.length === 0 && !showPicker && (
              <GlassCard className="text-center py-8">
                <Dumbbell
                  size={28}
                  className="mx-auto mb-2 text-dark-500"
                />
                <p className="text-sm text-dark-400">
                  No exercises added yet. Click &quot;Add Exercise&quot; to get
                  started.
                </p>
              </GlassCard>
            )}

            {exercises.map((ex, exIdx) => {
              const info = lookupExercise(ex.exerciseId);
              return (
                <GlassCard key={ex.exerciseId}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-dark-100">
                        {info?.name ?? 'Unknown Exercise'}
                      </h3>
                      {info && (
                        <Badge variant="default">{info.muscleGroup}</Badge>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exIdx)}
                      className="text-dark-400 hover:text-danger transition-colors cursor-pointer"
                      aria-label="Remove exercise"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {ex.sets.map((set, setIdx) => (
                      <ExerciseSetRow
                        key={setIdx}
                        set={set}
                        category={category}
                        onChange={(updated) =>
                          handleUpdateSet(exIdx, setIdx, updated)
                        }
                        onDelete={() => handleDeleteSet(exIdx, setIdx)}
                      />
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3"
                    onClick={() => handleAddSet(exIdx)}
                  >
                    <Plus size={14} className="mr-1" />
                    Add Set
                  </Button>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* -- Save -------------------------------------------------------- */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={!title.trim() || !durationMin}>
            Save Workout
          </Button>
          <Button variant="ghost" onClick={() => router.push('/workouts')}>
            Cancel
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
