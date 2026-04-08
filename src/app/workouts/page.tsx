'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import WorkoutCard from '@/components/workouts/WorkoutCard';
import { Plus, Dumbbell } from 'lucide-react';

export default function WorkoutsPage() {
  const { state } = useApp();

  const sortedWorkouts = [...state.workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <PageContainer>
      <Header
        title="Workouts"
        subtitle="Track your training"
        action={
          <Link href="/workouts/log">
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              Log Workout
            </Button>
          </Link>
        }
      />

      {sortedWorkouts.length === 0 ? (
        <GlassCard className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Dumbbell size={32} className="text-dark-400" />
          </div>
          <h2 className="text-lg font-semibold text-dark-200 mb-2">
            No workouts yet
          </h2>
          <p className="text-dark-400 mb-6 max-w-sm mx-auto">
            Every rep counts. Start logging your workouts and watch your
            progress compound over time.
          </p>
          <Link href="/workouts/log">
            <Button>
              <Plus size={16} className="mr-1.5" />
              Log your first workout
            </Button>
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {sortedWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
