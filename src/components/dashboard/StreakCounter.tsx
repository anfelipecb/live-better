'use client';

import { useApp } from '@/context/AppContext';
import { getToday, formatDate } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import { Flame } from 'lucide-react';

export default function StreakCounter() {
  const { state } = useApp();
  const today = getToday();

  // Calculate the longest active streak across all habits
  const longestStreak = state.habits.reduce((best, habit) => {
    let streak = 0;
    const date = new Date(today + 'T12:00:00');

    while (true) {
      const dateStr = formatDate(date);
      const log = state.habitLogs.find(
        (l) => l.habitId === habit.id && l.date === dateStr && l.completed,
      );

      if (!log) break;

      streak++;
      date.setDate(date.getDate() - 1);
    }

    return Math.max(best, streak);
  }, 0);

  return (
    <GlassCard accent className="flex flex-col items-center gap-3">
      <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
        Streak
      </h3>

      <div className="flex items-center gap-3">
        <Flame
          className={longestStreak > 0 ? 'text-warning' : 'text-dark-500'}
          size={32}
        />
        {longestStreak > 0 ? (
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-dark-100">
              {longestStreak}
            </span>
            <span className="text-xs text-dark-400">day streak</span>
          </div>
        ) : (
          <p className="text-dark-400 text-sm">Start a streak today!</p>
        )}
      </div>
    </GlassCard>
  );
}
