'use client';

import type { TimeBlock as TimeBlockType } from '@/types';
import { useApp } from '@/context/AppContext';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import TaskItem from '@/components/planner/TaskItem';
import { Sun, CloudSun, Moon, Plus } from 'lucide-react';

interface TimeBlockProps {
  timeBlock: TimeBlockType;
  date: string;
  onAddTask: (block: TimeBlockType) => void;
}

const blockConfig: Record<
  TimeBlockType,
  { label: string; subtitle: string; icon: typeof Sun }
> = {
  morning: { label: 'Morning', subtitle: '6 AM - 12 PM', icon: Sun },
  afternoon: { label: 'Afternoon', subtitle: '12 PM - 6 PM', icon: CloudSun },
  evening: { label: 'Evening', subtitle: '6 PM - 12 AM', icon: Moon },
};

export default function TimeBlock({ timeBlock, date, onAddTask }: TimeBlockProps) {
  const { state } = useApp();

  const tasks = state.tasks.filter(
    (t) => t.date === date && t.timeBlock === timeBlock,
  );

  const config = blockConfig[timeBlock];
  const Icon = config.icon;

  return (
    <GlassCard>
      {/* Block header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-dark-100">{config.label}</h3>
            <p className="text-xs text-dark-400">{config.subtitle}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(timeBlock)}
        >
          <Plus size={16} className="mr-1" />
          Add Task
        </Button>
      </div>

      {/* Task list */}
      {tasks.length > 0 ? (
        <div className="flex flex-col gap-1">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8 text-dark-500 text-sm">
          No tasks yet. Click &quot;Add Task&quot; to get started.
        </div>
      )}
    </GlassCard>
  );
}
