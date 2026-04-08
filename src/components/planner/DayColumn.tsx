'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/ui/GlassCard';
import type { WorkoutCategory } from '@/types';

// ── Color map for workout categories ──────────────────────────────────

const categoryColor: Record<WorkoutCategory, string> = {
  strength: 'bg-strength',
  cycling: 'bg-cycling',
  yoga: 'bg-yoga',
  rest: 'bg-rest',
};

// ── Props ─────────────────────────────────────────────────────────────

interface DayColumnProps {
  date: string;
  isToday: boolean;
}

// ── Component ─────────────────────────────────────────────────────────

export default function DayColumn({ date, isToday }: DayColumnProps) {
  const { state } = useApp();

  // Parse date for display
  const d = new Date(date + 'T12:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = d.getDate();

  // Data for this date
  const workout = state.workouts.find((w) => w.date === date);
  const tasks = state.tasks.filter((t) => t.date === date);
  const completedTasks = tasks.filter((t) => t.completed).length;
  const meals = state.mealAssignments.filter((m) => m.date === date);
  const hasMeals = meals.length > 0;

  return (
    <Link href={`/day/${date}`} className="block">
      <GlassCard
        hover
        accent={isToday}
        className={`p-4 flex flex-col gap-3 cursor-pointer ${
          isToday
            ? 'ring-1 ring-accent/50 shadow-[0_0_16px_rgba(99,102,241,0.15)]'
            : ''
        }`}
      >
        {/* Day header */}
        <div className="text-center">
          <p className={`text-sm font-medium ${isToday ? 'text-accent' : 'text-dark-400'}`}>
            {dayName}
          </p>
          <p className={`text-lg font-bold ${isToday ? 'text-dark-100' : 'text-dark-200'}`}>
            {dayNumber}
          </p>
        </div>

        {/* Workout */}
        <div className="flex items-center gap-2 min-h-[24px]">
          {workout ? (
            <>
              <span className={`w-2 h-2 rounded-full shrink-0 ${categoryColor[workout.category]}`} />
              <span className="text-xs text-dark-300 truncate">{workout.title}</span>
            </>
          ) : (
            <span className="text-xs text-dark-500 italic">No workout</span>
          )}
        </div>

        {/* Tasks */}
        <div className="flex items-center gap-2 min-h-[20px]">
          {tasks.length > 0 ? (
            <span className="text-xs text-dark-300">
              {completedTasks}/{tasks.length} tasks
            </span>
          ) : (
            <span className="text-xs text-dark-500 italic">No tasks</span>
          )}
        </div>

        {/* Meals */}
        <div className="flex items-center gap-2 min-h-[20px]">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              hasMeals ? 'bg-success' : 'bg-dark-600'
            }`}
          />
          <span className="text-xs text-dark-400">
            {hasMeals ? `${meals.length} meal${meals.length > 1 ? 's' : ''}` : 'No meals'}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
