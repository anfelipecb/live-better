'use client';

import type { Task } from '@/types';
import { useApp } from '@/context/AppContext';
import Badge from '@/components/ui/Badge';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

const priorityVariant: Record<Task['priority'], 'danger' | 'warning' | 'default'> = {
  high: 'danger',
  medium: 'warning',
  low: 'default',
};

export default function TaskItem({ task }: TaskItemProps) {
  const { dispatch } = useApp();

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
        'hover:bg-white/5 group',
        task.completed && 'opacity-50',
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
        className="h-4 w-4 rounded border-dark-500 bg-dark-700 accent-accent cursor-pointer shrink-0"
      />

      {/* Title */}
      <span
        className={cn(
          'flex-1 text-sm text-dark-100 transition-all duration-200',
          task.completed && 'line-through text-dark-400',
        )}
      >
        {task.title}
      </span>

      {/* Priority Badge */}
      <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>

      {/* Delete Button */}
      <button
        onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
        className="text-dark-500 hover:text-danger transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
        aria-label="Delete task"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
