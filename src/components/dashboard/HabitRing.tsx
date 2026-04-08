'use client';

import { useApp } from '@/context/AppContext';
import { getToday } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import ProgressRing from '@/components/ui/ProgressRing';

export default function HabitRing() {
  const { state } = useApp();
  const today = getToday();

  const totalHabits = state.habits.length;
  const completedHabits = state.habitLogs.filter(
    (log) => log.date === today && log.completed,
  ).length;

  const percentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <GlassCard className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
        Today&apos;s Habits
      </h3>

      {totalHabits === 0 ? (
        <div className="text-center py-4">
          <p className="text-dark-400 text-sm">No habits tracked yet.</p>
          <p className="text-dark-500 text-xs mt-1">Add habits to see your progress here.</p>
        </div>
      ) : (
        <>
          <ProgressRing value={percentage} size={120} strokeWidth={8}>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-dark-100">
                {percentage}%
              </span>
              <span className="text-xs text-dark-400">
                {completedHabits}/{totalHabits} habits
              </span>
            </div>
          </ProgressRing>

          {completedHabits === totalHabits && totalHabits > 0 && (
            <p className="text-success text-sm font-medium">All habits complete!</p>
          )}
        </>
      )}
    </GlassCard>
  );
}
