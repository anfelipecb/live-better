'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { getToday } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { ClipboardList, Sun, CloudSun, Moon } from 'lucide-react';
import type { TimeBlock, Priority } from '@/types';

const timeBlockIcons: Record<TimeBlock, typeof Sun> = {
  morning: Sun,
  afternoon: CloudSun,
  evening: Moon,
};

const priorityVariant: Record<Priority, 'danger' | 'warning' | 'default'> = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

export default function UpcomingTasks() {
  const { state, dispatch } = useApp();
  const today = getToday();

  const todayTasks = state.tasks
    .filter((t) => t.date === today)
    .slice(0, 5);

  const handleToggle = (taskId: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: taskId });
  };

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
          Today&apos;s Tasks
        </h3>
        <ClipboardList className="text-dark-400" size={18} />
      </div>

      {todayTasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-dark-400 text-sm">No tasks for today.</p>
          <Link
            href={`/day/${today}`}
            className="text-accent text-sm font-medium hover:underline"
          >
            Plan your day
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {todayTasks.map((task) => {
              const TimeIcon = timeBlockIcons[task.timeBlock];
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 py-1.5"
                >
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-accent border-accent'
                        : 'border-dark-500 hover:border-dark-300'
                    }`}
                    aria-label={`Toggle ${task.title}`}
                  >
                    {task.completed && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className="text-dark-900"
                      >
                        <path
                          d="M2 5L4 7L8 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  <TimeIcon size={14} className="text-dark-500 flex-shrink-0" />

                  <span
                    className={`text-sm flex-1 ${
                      task.completed
                        ? 'text-dark-500 line-through'
                        : 'text-dark-200'
                    }`}
                  >
                    {task.title}
                  </span>

                  <Badge variant={priorityVariant[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </div>

          <Link
            href={`/day/${today}`}
            className="text-accent text-xs font-medium hover:underline text-center mt-1"
          >
            View full day planner
          </Link>
        </>
      )}
    </GlassCard>
  );
}
