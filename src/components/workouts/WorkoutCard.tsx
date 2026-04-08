'use client';

import Link from 'next/link';
import type { WorkoutLog } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { Dumbbell, Clock, Check } from 'lucide-react';

interface WorkoutCardProps {
  workout: WorkoutLog;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const formattedDate = new Date(workout.date + 'T12:00:00').toLocaleDateString(
    'en-US',
    { weekday: 'short', month: 'short', day: 'numeric' },
  );

  return (
    <Link href={`/workouts/${workout.id}`}>
      <GlassCard hover className="cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <Dumbbell size={20} className="text-dark-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-dark-100 truncate">
                {workout.title}
              </h3>
              <p className="text-sm text-dark-400">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge variant={workout.category}>{workout.category}</Badge>

            <div className="flex items-center gap-1 text-sm text-dark-400">
              <Clock size={14} />
              <span>{workout.durationMin}m</span>
            </div>

            {workout.category !== 'rest' && (
              <span className="text-sm text-dark-400">
                {workout.exercises.length}{' '}
                {workout.exercises.length === 1 ? 'exercise' : 'exercises'}
              </span>
            )}

            {workout.completed && (
              <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                <Check size={14} className="text-success" />
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
