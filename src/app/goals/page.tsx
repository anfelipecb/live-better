'use client';

import { useState, useMemo } from 'react';
import { Target, Plus, Trash2, Flame, Check, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Modal from '@/components/ui/Modal';
import { generateId, getToday, formatDate } from '@/lib/utils';
import type { Habit, Goal, Milestone } from '@/types';

// ── Helpers ──────────────────────────────────────────────────────────

const PREDEFINED_COLORS = [
  { label: 'Blue', value: 'blue' },
  { label: 'Green', value: 'green' },
  { label: 'Purple', value: 'purple' },
  { label: 'Amber', value: 'amber' },
  { label: 'Pink', value: 'pink' },
  { label: 'Cyan', value: 'cyan' },
  { label: 'Indigo', value: 'indigo' },
  { label: 'Rose', value: 'rose' },
];

const CATEGORY_BADGE_MAP: Record<Goal['category'], 'warning' | 'danger' | 'success' | 'default'> = {
  academic: 'warning',
  career: 'danger',
  fitness: 'success',
  personal: 'default',
};

/** Get the last 7 days ending on today (most recent last). */
function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

/** Short weekday label for a date string (e.g. "M", "T", "W"). */
function getShortDay(date: string): string {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'narrow' });
}

// ── Page Component ───────────────────────────────────────────────────

export default function GoalsPage() {
  const { state, dispatch } = useApp();
  const { habits, habitLogs, goals } = state;
  const today = getToday();

  // Modal state
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [goalModalOpen, setGoalModalOpen] = useState(false);

  // ── Habit form state ────────────────────────────────────────────────
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('');
  const [newHabitColor, setNewHabitColor] = useState('blue');
  const [newHabitTarget, setNewHabitTarget] = useState(1);

  // ── Goal form state ─────────────────────────────────────────────────
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<Goal['category']>('personal');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalMilestones, setNewGoalMilestones] = useState<{ title: string; deadline: string }[]>([]);
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestoneDeadlineInput, setMilestoneDeadlineInput] = useState('');

  // ── Computed ────────────────────────────────────────────────────────

  const last7Days = useMemo(() => getLast7Days(), []);

  /** Calculate streak for a habit (consecutive completed days backward from today). */
  function calculateStreak(habitId: string): number {
    let streak = 0;
    const d = new Date();
    while (true) {
      const dateStr = formatDate(d);
      const log = habitLogs.find(
        (l) => l.habitId === habitId && l.date === dateStr && l.completed,
      );
      if (!log) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  /** Check if a habit is completed on a given date. */
  function isHabitCompleted(habitId: string, date: string): boolean {
    return habitLogs.some(
      (l) => l.habitId === habitId && l.date === date && l.completed,
    );
  }

  // ── Handlers ────────────────────────────────────────────────────────

  function handleToggleHabit(habitId: string) {
    dispatch({ type: 'TOGGLE_HABIT', payload: { habitId, date: today } });
  }

  function handleDeleteHabit(habitId: string) {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  }

  function handleAddHabit() {
    if (!newHabitName.trim()) return;
    const habit: Habit = {
      id: generateId(),
      name: newHabitName.trim(),
      icon: newHabitIcon || '✅',
      color: newHabitColor,
      targetPerDay: newHabitTarget,
    };
    dispatch({ type: 'ADD_HABIT', payload: habit });
    setNewHabitName('');
    setNewHabitIcon('');
    setNewHabitColor('blue');
    setNewHabitTarget(1);
    setHabitModalOpen(false);
  }

  function handleDeleteGoal(goalId: string) {
    dispatch({ type: 'DELETE_GOAL', payload: goalId });
  }

  function handleToggleMilestone(goalId: string, milestoneId: string) {
    dispatch({ type: 'TOGGLE_MILESTONE', payload: { goalId, milestoneId } });
  }

  function handleAddMilestone() {
    if (!milestoneInput.trim()) return;
    setNewGoalMilestones((prev) => [
      ...prev,
      { title: milestoneInput.trim(), deadline: milestoneDeadlineInput },
    ]);
    setMilestoneInput('');
    setMilestoneDeadlineInput('');
  }

  function handleRemoveMilestone(idx: number) {
    setNewGoalMilestones((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddGoal() {
    if (!newGoalTitle.trim()) return;
    const goal: Goal = {
      id: generateId(),
      title: newGoalTitle.trim(),
      description: newGoalDesc.trim(),
      category: newGoalCategory,
      deadline: newGoalDeadline || undefined,
      milestones: newGoalMilestones.map((m) => ({
        id: generateId(),
        title: m.title,
        deadline: m.deadline || undefined,
        completed: false,
      })),
    };
    dispatch({ type: 'ADD_GOAL', payload: goal });
    setNewGoalTitle('');
    setNewGoalDesc('');
    setNewGoalCategory('personal');
    setNewGoalDeadline('');
    setNewGoalMilestones([]);
    setGoalModalOpen(false);
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <PageContainer>
      <Header
        title="Goals & Habits"
        subtitle="Build consistency, track progress"
        action={
          <div className="flex items-center gap-2">
            <Target size={20} className="text-accent" />
          </div>
        }
      />

      {/* ════════════════════════════════════════════════════════════════
          Section 1: Daily Habits
          ════════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-100">Today&apos;s Habits</h2>
          <Button size="sm" onClick={() => setHabitModalOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            Add Habit
          </Button>
        </div>

        {habits.length === 0 ? (
          <GlassCard>
            <p className="text-dark-400 text-center py-4">
              No habits yet. Add one to start tracking!
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const completed = isHabitCompleted(habit.id, today);
              const streak = calculateStreak(habit.id);

              return (
                <GlassCard key={habit.id} hover className="!p-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: icon, name, streak */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{habit.icon}</span>
                      <div className="min-w-0">
                        <p className="text-dark-100 font-medium truncate">
                          {habit.name}
                        </p>
                        {streak > 0 && (
                          <span className="text-xs text-dark-400 flex items-center gap-1">
                            <Flame size={12} className="text-warning" />
                            {streak} day{streak !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: toggle + delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          completed
                            ? 'bg-success/20 border-2 border-success text-success'
                            : 'bg-dark-700 border-2 border-dark-500 text-dark-500 hover:border-dark-400'
                        }`}
                        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {completed && <Check size={18} />}
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="p-2 text-dark-500 hover:text-danger transition-colors cursor-pointer"
                        aria-label="Delete habit"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Weekly view: 7-day grid */}
                  <div className="mt-3 flex items-center gap-2 justify-end">
                    {last7Days.map((date) => {
                      const done = isHabitCompleted(habit.id, date);
                      const isToday = date === today;
                      return (
                        <div key={date} className="flex flex-col items-center gap-1">
                          <span
                            className={`text-[10px] ${
                              isToday ? 'text-accent font-semibold' : 'text-dark-500'
                            }`}
                          >
                            {getShortDay(date)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              done
                                ? 'bg-success/30 border-success'
                                : isToday
                                  ? 'border-accent/50 bg-transparent'
                                  : 'border-dark-600 bg-transparent'
                            }`}
                          >
                            {done && <Check size={10} className="text-success" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          Section 2: Goals
          ════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-100">Goals</h2>
          <Button size="sm" onClick={() => setGoalModalOpen(true)}>
            <Plus size={16} className="mr-1.5" />
            Add Goal
          </Button>
        </div>

        {goals.length === 0 ? (
          <GlassCard>
            <p className="text-dark-400 text-center py-4">
              No goals yet. Set one to start your journey!
            </p>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => {
              const completedCount = goal.milestones.filter((m) => m.completed).length;
              const totalCount = goal.milestones.length;
              const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <GlassCard key={goal.id} hover>
                  {/* Goal header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-semibold text-dark-100">
                          {goal.title}
                        </h3>
                        <Badge variant={CATEGORY_BADGE_MAP[goal.category]}>
                          {goal.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-dark-400 line-clamp-2">
                        {goal.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-dark-500 hover:text-danger transition-colors shrink-0 cursor-pointer"
                      aria-label="Delete goal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center gap-1.5 text-xs text-dark-400 mb-3">
                      <Calendar size={12} />
                      <span>
                        Deadline: {new Date(goal.deadline + 'T12:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}

                  {/* Progress bar */}
                  {totalCount > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-dark-400 mb-1.5">
                        <span>Progress</span>
                        <span>
                          {completedCount}/{totalCount} milestones ({progress}%)
                        </span>
                      </div>
                      <ProgressBar value={progress} color="success" size="sm" />
                    </div>
                  )}

                  {/* Milestones checklist */}
                  {totalCount > 0 && (
                    <ul className="space-y-2">
                      {goal.milestones.map((ms) => (
                        <li key={ms.id} className="flex items-start gap-2">
                          <button
                            onClick={() => handleToggleMilestone(goal.id, ms.id)}
                            className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 transition-colors cursor-pointer ${
                              ms.completed
                                ? 'bg-success/20 border-success text-success'
                                : 'border-dark-500 text-transparent hover:border-dark-400'
                            }`}
                            aria-label={ms.completed ? 'Uncheck milestone' : 'Check milestone'}
                          >
                            <Check size={12} />
                          </button>
                          <div className="min-w-0">
                            <span
                              className={`text-sm ${
                                ms.completed
                                  ? 'line-through text-dark-500'
                                  : 'text-dark-200'
                              }`}
                            >
                              {ms.title}
                            </span>
                            {ms.deadline && (
                              <span className="block text-[10px] text-dark-500">
                                Due {new Date(ms.deadline + 'T12:00:00').toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
          Add Habit Modal
          ════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        title="Add Habit"
      >
        <div className="space-y-4">
          <Input
            label="Habit Name"
            placeholder="e.g. Drink water"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
          />
          <Input
            label="Icon (emoji)"
            placeholder="e.g. 💧"
            value={newHabitIcon}
            onChange={(e) => setNewHabitIcon(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark-200">Color</label>
            <select
              value={newHabitColor}
              onChange={(e) => setNewHabitColor(e.target.value)}
              className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 outline-none transition-colors"
            >
              {PREDEFINED_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Target per Day"
            type="number"
            min={1}
            value={newHabitTarget}
            onChange={(e) => setNewHabitTarget(Number(e.target.value))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setHabitModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit} disabled={!newHabitName.trim()}>
              <Plus size={16} className="mr-1.5" />
              Add Habit
            </Button>
          </div>
        </div>
      </Modal>

      {/* ════════════════════════════════════════════════════════════════
          Add Goal Modal
          ════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title="Add Goal"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input
            label="Title"
            placeholder="e.g. Run a marathon"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark-200">Description</label>
            <textarea
              className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 placeholder-dark-400 outline-none transition-colors resize-none"
              rows={3}
              placeholder="Describe your goal..."
              value={newGoalDesc}
              onChange={(e) => setNewGoalDesc(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark-200">Category</label>
            <select
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value as Goal['category'])}
              className="w-full bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 outline-none transition-colors"
            >
              <option value="personal">Personal</option>
              <option value="academic">Academic</option>
              <option value="career">Career</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>
          <Input
            label="Deadline (optional)"
            type="date"
            value={newGoalDeadline}
            onChange={(e) => setNewGoalDeadline(e.target.value)}
          />

          {/* Milestones builder */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark-200">Milestones</label>
            {newGoalMilestones.length > 0 && (
              <ul className="space-y-2 mb-2">
                {newGoalMilestones.map((m, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2 bg-dark-800 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <span className="text-sm text-dark-200 truncate block">
                        {m.title}
                      </span>
                      {m.deadline && (
                        <span className="text-[10px] text-dark-500">
                          Due {m.deadline}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-dark-500 hover:text-danger transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Milestone title"
                value={milestoneInput}
                onChange={(e) => setMilestoneInput(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMilestone();
                  }
                }}
              />
              <Input
                type="date"
                value={milestoneDeadlineInput}
                onChange={(e) => setMilestoneDeadlineInput(e.target.value)}
                className="w-36"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddMilestone}
                disabled={!milestoneInput.trim()}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setGoalModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal} disabled={!newGoalTitle.trim()}>
              <Plus size={16} className="mr-1.5" />
              Add Goal
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
