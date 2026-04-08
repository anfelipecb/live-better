'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getToday, getWeekDates, formatDate } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import DayColumn from '@/components/planner/DayColumn';

export default function WeekPage() {
  const { state } = useApp();
  const today = getToday();

  // Track the Monday of the displayed week
  const [weekStart, setWeekStart] = useState<string>(() => getWeekDates(today)[0]);

  const weekDates = getWeekDates(weekStart);

  // ── Navigation helpers ──────────────────────────────────────────────

  function navigateWeek(offset: number) {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() + 7 * offset);
    setWeekStart(formatDate(d));
  }

  function goToThisWeek() {
    setWeekStart(getWeekDates(today)[0]);
  }

  const isCurrentWeek = weekStart === getWeekDates(today)[0];

  // ── Week label ──────────────────────────────────────────────────────

  const firstDate = new Date(weekDates[0] + 'T12:00:00');
  const lastDate = new Date(weekDates[6] + 'T12:00:00');

  const weekLabel =
    firstDate.getMonth() === lastDate.getMonth()
      ? `${firstDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${lastDate.getDate()}, ${lastDate.getFullYear()}`
      : `${firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // ── Summary stats ───────────────────────────────────────────────────

  const weekWorkouts = state.workouts.filter((w) =>
    weekDates.includes(w.date),
  );
  const weekTasks = state.tasks.filter((t) => weekDates.includes(t.date));
  const completedWeekTasks = weekTasks.filter((t) => t.completed);
  const daysWithMeals = weekDates.filter((date) =>
    state.mealAssignments.some((m) => m.date === date),
  ).length;

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <PageContainer>
      <Header
        title="Week Overview"
        subtitle={weekLabel}
        action={
          <div className="flex items-center gap-2">
            {!isCurrentWeek && (
              <Button variant="ghost" size="sm" onClick={goToThisWeek}>
                This Week
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek(-1)}
              aria-label="Previous week"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateWeek(1)}
              aria-label="Next week"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        }
      />

      {/* Day cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {weekDates.map((date) => (
          <DayColumn key={date} date={date} isToday={date === today} />
        ))}
      </div>

      {/* Summary row */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-dark-100">{weekWorkouts.length}</p>
          <p className="text-sm text-dark-400">Workouts</p>
        </div>
        <div className="hidden sm:block w-px h-10 bg-dark-600" />
        <div>
          <p className="text-2xl font-bold text-dark-100">
            {completedWeekTasks.length}
            <span className="text-dark-400 font-normal text-base">/{weekTasks.length}</span>
          </p>
          <p className="text-sm text-dark-400">Tasks Completed</p>
        </div>
        <div className="hidden sm:block w-px h-10 bg-dark-600" />
        <div>
          <p className="text-2xl font-bold text-dark-100">{daysWithMeals}</p>
          <p className="text-sm text-dark-400">Days with Meals</p>
        </div>
      </GlassCard>
    </PageContainer>
  );
}
