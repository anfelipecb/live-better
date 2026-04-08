'use client';

import PageContainer from "@/components/layout/PageContainer";
import { useApp } from "@/context/AppContext";
import { getGreeting } from "@/lib/utils";
import HabitRing from "@/components/dashboard/HabitRing";
import StreakCounter from "@/components/dashboard/StreakCounter";
import TodayWorkout from "@/components/dashboard/TodayWorkout";
import TodayMeals from "@/components/dashboard/TodayMeals";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import QuickActions from "@/components/dashboard/QuickActions";
import GoalProgress from "@/components/dashboard/GoalProgress";

export default function Home() {
  const { state } = useApp();

  return (
    <PageContainer>
      {/* Greeting */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-dark-100">
          {getGreeting(state.profile.name)}
        </h1>
        <p className="text-dark-400 mt-1">
          Here&apos;s your day at a glance. Let&apos;s make it count.
        </p>
      </div>

      {/* Top row: Habits + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 animate-slide-up">
        <div className="md:col-span-1">
          <HabitRing />
        </div>
        <div className="md:col-span-1">
          <StreakCounter />
        </div>
        <div className="md:col-span-1">
          <TodayWorkout />
        </div>
      </div>

      {/* Middle row: Tasks + Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <UpcomingTasks />
        <TodayMeals />
      </div>

      {/* Goals */}
      <div className="mb-4">
        <GoalProgress />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </PageContainer>
  );
}
