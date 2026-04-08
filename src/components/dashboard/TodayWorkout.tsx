'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getToday } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { Dumbbell } from 'lucide-react';
import type { WorkoutCategory } from '@/types';

const categoryVariant: Record<WorkoutCategory, NonNullable<'strength' | 'cycling' | 'yoga' | 'rest'>> = {
  strength: 'strength',
  cycling: 'cycling',
  yoga: 'yoga',
  rest: 'rest',
};

export default function TodayWorkout() {
  const { state } = useApp();
  const today = getToday();

  const todayWorkout = state.workouts.find((w) => w.date === today);

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
          Today&apos;s Workout
        </h3>
        <Dumbbell className="text-dark-400" size={18} />
      </div>

      {todayWorkout ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-dark-100">
              {todayWorkout.title}
            </span>
            <Badge variant={categoryVariant[todayWorkout.category]}>
              {todayWorkout.category}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-dark-300">
            <span>{todayWorkout.durationMin} min</span>
            <span>{todayWorkout.exercises.length} exercises</span>
          </div>

          {todayWorkout.completed && (
            <Badge variant="success">Completed</Badge>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-dark-400 text-sm">No workout planned for today.</p>
          <Link
            href="/workouts/log"
            className="text-accent text-sm font-medium hover:underline"
          >
            Log a workout
          </Link>
        </div>
      )}
    </GlassCard>
  );
}
