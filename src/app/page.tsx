'use client';

import { useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Swords,
  Dumbbell,
  Droplets,
  Utensils,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  CalendarDays,
  ChefHat,
  Target,
  Zap,
  ListChecks,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getToday, getTimeOfDay, cn, generateId } from '@/lib/utils';
import { getLevel, getNextLevel, getXPProgress, getTodayXP } from '@/lib/gamification';
import { XP_VALUES, LEVELS } from '@/types';
import type { MealSlot, TimeBlock } from '@/types';

// ── Workout schedule by day of week ──────────────────────────────────

const WORKOUT_SCHEDULE: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Push Day', emoji: '💪' },
  2: { label: 'Cycling', emoji: '🚴' },
  3: { label: 'Pull Day', emoji: '🏋️' },
  4: { label: 'Yoga', emoji: '🧘' },
  5: { label: 'Leg Day', emoji: '🦵' },
  6: { label: 'Full Body', emoji: '⚡' },
  0: { label: 'Rest & Recovery', emoji: '🛌' },
};

// ── Greeting based on time of day ────────────────────────────────────

function getQuestGreeting(name: string): string {
  const time = getTimeOfDay();
  switch (time) {
    case 'morning':
      return `Rise and grind, ${name}`;
    case 'afternoon':
      return `Keep pushing, ${name}`;
    case 'evening':
      return `Wind down, ${name}`;
  }
}

// ── Component ────────────────────────────────────────────────────────

export default function Home() {
  const { state, dispatch } = useApp();
  const today = getToday();
  const dayOfWeek = new Date().getDay();

  // ── Gamification data ──────────────────────────────────────────────

  const totalXP = state.totalXP;
  const level = getLevel(totalXP);
  const nextLevel = getNextLevel(totalXP);
  const xpProgress = getXPProgress(totalXP);
  const todayXP = getTodayXP(state.xpEvents, today);

  // ── Workout quest ──────────────────────────────────────────────────

  const todayWorkout = WORKOUT_SCHEDULE[dayOfWeek];
  const workoutCompleted = state.workouts.some(
    (w) => w.date === today && w.completed,
  );

  // ── Nutrition quest ────────────────────────────────────────────────

  const mealSlots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const todayMeals = state.mealAssignments.filter((m) => m.date === today);
  const filledSlots = new Set(todayMeals.map((m) => m.slot));

  // ── Hydration quest ────────────────────────────────────────────────

  const waterHabit = state.habits.find((h) => h.id === 'habit-water');
  const waterLogs = state.habitLogs.filter(
    (log) => log.habitId === 'habit-water' && log.date === today && log.completed,
  );
  // For water, we track per-glass. Use value field or count completed toggles.
  // Since water targetPerDay is 8, we'll use a simple counter based on habit log value
  const waterCount = useMemo(() => {
    const log = state.habitLogs.find(
      (l) => l.habitId === 'habit-water' && l.date === today,
    );
    return log?.value ?? (log?.completed ? waterHabit?.targetPerDay ?? 8 : 0);
  }, [state.habitLogs, today, waterHabit]);

  // For the home page we use a local counter approach via XP events
  const waterGlasses = useMemo(() => {
    return state.xpEvents.filter(
      (e) => e.date === today && e.type === 'hydration',
    ).length;
  }, [state.xpEvents, today]);

  const handleDrinkWater = useCallback(() => {
    if (waterGlasses >= 8) return;
    dispatch({
      type: 'ADD_XP',
      payload: {
        id: generateId(),
        date: today,
        type: 'hydration',
        description: `Drank glass ${waterGlasses + 1} of water`,
        xp: XP_VALUES.DRINK_WATER,
      },
    });
    // Also toggle habit if we hit target
    if (waterGlasses + 1 >= (waterHabit?.targetPerDay ?? 8)) {
      dispatch({
        type: 'TOGGLE_HABIT',
        payload: { habitId: 'habit-water', date: today },
      });
    }
  }, [waterGlasses, today, dispatch, waterHabit]);

  // ── Habit quests (non-water) ───────────────────────────────────────

  const nonWaterHabits = state.habits.filter((h) => h.id !== 'habit-water');
  const habitCompletionMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const habit of nonWaterHabits) {
      const log = state.habitLogs.find(
        (l) => l.habitId === habit.id && l.date === today,
      );
      map[habit.id] = log?.completed ?? false;
    }
    return map;
  }, [nonWaterHabits, state.habitLogs, today]);

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      const wasCompleted = habitCompletionMap[habitId];
      dispatch({
        type: 'TOGGLE_HABIT',
        payload: { habitId, date: today },
      });
      // Award XP only when completing (not uncompleting)
      if (!wasCompleted) {
        dispatch({
          type: 'ADD_XP',
          payload: {
            id: generateId(),
            date: today,
            type: 'habit',
            description: `Completed habit`,
            xp: XP_VALUES.COMPLETE_HABIT,
          },
        });
      }
    },
    [habitCompletionMap, today, dispatch],
  );

  // ── Tasks for today ────────────────────────────────────────────────

  const todayTasks = state.tasks.filter((t) => t.date === today);
  const tasksByBlock = useMemo(() => {
    const blocks: Record<TimeBlock, typeof todayTasks> = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    for (const task of todayTasks) {
      blocks[task.timeBlock].push(task);
    }
    return blocks;
  }, [todayTasks]);

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const task = todayTasks.find((t) => t.id === taskId);
      if (task && !task.completed) {
        dispatch({
          type: 'ADD_XP',
          payload: {
            id: generateId(),
            date: today,
            type: 'task',
            description: `Completed: ${task.title}`,
            xp: XP_VALUES.COMPLETE_TASK,
          },
        });
      }
      dispatch({ type: 'TOGGLE_TASK', payload: taskId });
    },
    [todayTasks, today, dispatch],
  );

  // ── Completion counts ──────────────────────────────────────────────

  const completedHabits = Object.values(habitCompletionMap).filter(Boolean).length;
  const totalHabits = nonWaterHabits.length;
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = todayTasks.length;

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 md:pb-8 max-w-lg mx-auto">
      {/* ── Player Status Card ─────────────────────────────────────── */}
      <section className="animate-fade-in mb-6">
        <div className="glass-quest rounded-2xl p-5">
          {/* Greeting + rank */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-dark-100">
                {getQuestGreeting(state.profile.name)}
              </h1>
              <p className="text-dark-400 text-sm mt-0.5">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <span
                className="rank-glow text-sm font-bold tracking-wide"
                style={{ color: level.color }}
              >
                {level.title}
              </span>
              <p className="text-dark-500 text-xs mt-0.5">Lv. {level.level}</p>
            </div>
          </div>

          {/* XP progress bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-dark-400 mb-1.5">
              <span>
                {xpProgress.current} / {xpProgress.needed} XP
              </span>
              {nextLevel && (
                <span style={{ color: nextLevel.color }}>
                  {nextLevel.title}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-dark-800 overflow-hidden">
              <div
                className="xp-bar h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* Today's XP */}
          <div className="flex items-center gap-1.5 mt-3">
            <Zap size={14} className="text-warning" />
            <span className="text-xs text-dark-300">
              <span className="text-warning font-semibold">+{todayXP} XP</span>{' '}
              earned today
            </span>
          </div>
        </div>
      </section>

      {/* ── Daily Quests ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <Swords size={18} className="text-accent" />
          <h2 className="text-lg font-bold text-dark-100">Daily Quests</h2>
        </div>

        <div className="space-y-3">
          {/* ── Quest 1: Workout ─────────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-4 transition-all duration-300 animate-slide-up',
              workoutCompleted ? 'glass-quest-done' : 'glass-quest',
            )}
            style={{ animationDelay: '0.15s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                  workoutCompleted
                    ? 'bg-success/20'
                    : 'bg-strength/20',
                )}
              >
                {workoutCompleted ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <Dumbbell size={20} className="text-strength" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-dark-100 truncate">
                    Today&apos;s Training
                  </h3>
                </div>
                <p className="text-xs text-dark-400 mt-0.5">
                  {todayWorkout.emoji} {todayWorkout.label}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-strength bg-strength/10 px-2 py-0.5 rounded-full">
                  +{XP_VALUES.COMPLETE_WORKOUT} XP
                </span>
                {!workoutCompleted && dayOfWeek !== 0 && (
                  <Link
                    href="/workouts/log"
                    className="text-dark-400 hover:text-dark-200 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>

            {workoutCompleted && (
              <p className="text-xs text-success mt-2 ml-13">
                Workout completed! Well done.
              </p>
            )}
          </div>

          {/* ── Quest 2: Nutrition ───────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-4 transition-all duration-300 animate-slide-up',
              filledSlots.size === 4 ? 'glass-quest-done' : 'glass-quest',
            )}
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  filledSlots.size === 4 ? 'bg-success/20' : 'bg-warning/20',
                )}
              >
                {filledSlots.size === 4 ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <Utensils size={20} className="text-warning" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-dark-100">
                  Fuel Your Body
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  {mealSlots.map((slot) => (
                    <div
                      key={slot}
                      className={cn(
                        'w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center',
                        filledSlots.has(slot)
                          ? 'bg-success border-success'
                          : 'border-dark-600 bg-transparent',
                      )}
                      title={slot}
                    >
                      {filledSlots.has(slot) && (
                        <CheckCircle2 size={12} className="text-dark-950" />
                      )}
                    </div>
                  ))}
                  <span className="text-xs text-dark-500 ml-1">
                    {filledSlots.size}/{mealSlots.length} meals
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                  +{XP_VALUES.LOG_MEAL} XP/meal
                </span>
                <Link
                  href="/meals"
                  className="text-dark-400 hover:text-dark-200 transition-colors"
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Quest 3: Hydration ──────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-4 transition-all duration-300 animate-slide-up',
              waterGlasses >= 8 ? 'glass-quest-done' : 'glass-quest',
            )}
            style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  waterGlasses >= 8 ? 'bg-success/20' : 'bg-cycling/20',
                )}
              >
                {waterGlasses >= 8 ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <Droplets size={20} className="text-cycling" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-dark-100">
                  Drink Water
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        // Only allow toggling the next unfilled glass
                        if (i === waterGlasses) handleDrinkWater();
                      }}
                      className={cn(
                        'w-5 h-5 rounded-full border-2 transition-all duration-200',
                        i < waterGlasses
                          ? 'bg-cycling border-cycling scale-100'
                          : i === waterGlasses
                            ? 'border-cycling/50 bg-transparent hover:bg-cycling/20 cursor-pointer'
                            : 'border-dark-600 bg-transparent cursor-default',
                      )}
                      disabled={i !== waterGlasses}
                      aria-label={`Glass ${i + 1}`}
                    />
                  ))}
                  <span className="text-xs text-dark-500 ml-1">
                    {waterGlasses}/8 glasses
                  </span>
                </div>
              </div>

              <span className="text-xs font-medium text-cycling bg-cycling/10 px-2 py-0.5 rounded-full">
                +{XP_VALUES.DRINK_WATER} XP/glass
              </span>
            </div>
          </div>

          {/* ── Quest 4: Habits ─────────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-4 transition-all duration-300 animate-slide-up',
              completedHabits === totalHabits && totalHabits > 0
                ? 'glass-quest-done'
                : 'glass-quest',
            )}
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  completedHabits === totalHabits && totalHabits > 0
                    ? 'bg-success/20'
                    : 'bg-accent/20',
                )}
              >
                {completedHabits === totalHabits && totalHabits > 0 ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <Sparkles size={20} className="text-accent" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-dark-100">
                  Daily Disciplines
                </h3>
                <p className="text-xs text-dark-400 mt-0.5">
                  {completedHabits}/{totalHabits} completed
                </p>
              </div>

              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                +{XP_VALUES.COMPLETE_HABIT} XP each
              </span>
            </div>

            <div className="space-y-2 ml-13">
              {nonWaterHabits.map((habit) => {
                const done = habitCompletionMap[habit.id];
                return (
                  <button
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={cn(
                      'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg transition-all duration-200',
                      done
                        ? 'bg-success/10 text-success'
                        : 'bg-white/3 text-dark-300 hover:bg-white/5',
                    )}
                  >
                    <span className="text-base">{habit.icon}</span>
                    <span
                      className={cn(
                        'text-sm flex-1',
                        done && 'line-through opacity-70',
                      )}
                    >
                      {habit.name}
                    </span>
                    {done && <CheckCircle2 size={14} className="text-success" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Quest 5: Tasks ──────────────────────────────────── */}
          <div
            className={cn(
              'rounded-xl p-4 transition-all duration-300 animate-slide-up',
              completedTasks === totalTasks && totalTasks > 0
                ? 'glass-quest-done'
                : 'glass-quest',
            )}
            style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  completedTasks === totalTasks && totalTasks > 0
                    ? 'bg-success/20'
                    : 'bg-danger/20',
                )}
              >
                {completedTasks === totalTasks && totalTasks > 0 ? (
                  <CheckCircle2 size={20} className="text-success" />
                ) : (
                  <ListChecks size={20} className="text-danger" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-dark-100">
                  Your Missions
                </h3>
                <p className="text-xs text-dark-400 mt-0.5">
                  {totalTasks > 0
                    ? `${completedTasks}/${totalTasks} tasks done`
                    : 'No missions planned'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-danger bg-danger/10 px-2 py-0.5 rounded-full">
                  +{XP_VALUES.COMPLETE_TASK} XP/task
                </span>
                <Link
                  href={`/day/${today}`}
                  className="text-dark-400 hover:text-dark-200 transition-colors"
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {totalTasks > 0 ? (
              <div className="space-y-2 ml-13">
                {(['morning', 'afternoon', 'evening'] as TimeBlock[]).map(
                  (block) => {
                    const tasks = tasksByBlock[block];
                    if (tasks.length === 0) return null;
                    return (
                      <div key={block}>
                        <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">
                          {block}
                        </p>
                        {tasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => handleToggleTask(task.id)}
                            className={cn(
                              'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg transition-all duration-200 mb-1',
                              task.completed
                                ? 'bg-success/10 text-success'
                                : 'bg-white/3 text-dark-300 hover:bg-white/5',
                            )}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                                task.completed
                                  ? 'bg-success border-success'
                                  : 'border-dark-500',
                              )}
                            >
                              {task.completed && (
                                <CheckCircle2
                                  size={10}
                                  className="text-dark-950"
                                />
                              )}
                            </div>
                            <span
                              className={cn(
                                'text-sm flex-1',
                                task.completed && 'line-through opacity-70',
                              )}
                            >
                              {task.title}
                            </span>
                            <span
                              className={cn(
                                'text-xs px-1.5 py-0.5 rounded',
                                task.priority === 'high'
                                  ? 'text-danger bg-danger/10'
                                  : task.priority === 'medium'
                                    ? 'text-warning bg-warning/10'
                                    : 'text-dark-400 bg-dark-700',
                              )}
                            >
                              {task.priority}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="ml-13">
                <Link
                  href={`/day/${today}`}
                  className="text-sm text-accent hover:text-accent-light transition-colors"
                >
                  Plan your day &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick Access ───────────────────────────────────────────── */}
      <section className="mt-6 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: CalendarDays, label: 'Planner', href: `/day/${today}`, color: 'text-accent' },
            { icon: Dumbbell, label: 'Workouts', href: '/workouts', color: 'text-strength' },
            { icon: ChefHat, label: 'Recipes', href: '/recipes', color: 'text-warning' },
            { icon: Target, label: 'Goals', href: '/goals', color: 'text-success' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="glass-quest rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-white/6 transition-all duration-200"
              >
                <Icon size={22} className={item.color} />
                <span className="text-xs text-dark-300">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
