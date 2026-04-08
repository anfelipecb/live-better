'use client';

import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Target } from 'lucide-react';
import type { Goal } from '@/types';

const categoryVariant: Record<Goal['category'], 'success' | 'warning' | 'danger' | 'default'> = {
  fitness: 'success',
  academic: 'warning',
  career: 'danger',
  personal: 'default',
};

export default function GoalProgress() {
  const { state } = useApp();

  // Show up to 3 active goals (those with incomplete milestones)
  const activeGoals = state.goals
    .filter((g) => g.milestones.some((m) => !m.completed))
    .slice(0, 3);

  const getCompletionPercent = (goal: Goal): number => {
    if (goal.milestones.length === 0) return 0;
    const completed = goal.milestones.filter((m) => m.completed).length;
    return Math.round((completed / goal.milestones.length) * 100);
  };

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
          Goal Progress
        </h3>
        <Target className="text-dark-400" size={18} />
      </div>

      {activeGoals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-dark-400 text-sm">No active goals yet.</p>
          <p className="text-dark-500 text-xs">
            Set goals to track your progress here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeGoals.map((goal) => {
            const percent = getCompletionPercent(goal);
            return (
              <div key={goal.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-dark-200">
                    {goal.title}
                  </span>
                  <Badge variant={categoryVariant[goal.category]}>
                    {goal.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={percent} size="sm" className="flex-1" />
                  <span className="text-xs text-dark-400 w-8 text-right">
                    {percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
