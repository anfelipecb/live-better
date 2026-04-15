import type {
  Profile,
  BodyStats,
  Task,
  WorkoutLog,
  MealAssignment,
  ShoppingItem,
  Habit,
  HabitLog,
  Goal,
  XPEvent,
  Reward,
} from '@/types';

// ── Profile ──────────────────────────────────────────────────────────

export function profileToDb(profile: Partial<Profile>, userId: string) {
  return {
    user_id: userId,
    ...(profile.name !== undefined && { name: profile.name }),
    ...(profile.age !== undefined && { age: profile.age }),
    ...(profile.heightCm !== undefined && { height_cm: profile.heightCm }),
    ...(profile.goalType !== undefined && { goal_type: profile.goalType }),
    ...(profile.targetCalories !== undefined && { target_calories: profile.targetCalories }),
    ...(profile.targetProtein !== undefined && { target_protein: profile.targetProtein }),
  };
}

export function profileFromDb(row: Record<string, unknown>): Profile {
  return {
    name: row.name as string,
    age: row.age as number,
    heightCm: row.height_cm as number,
    goalType: row.goal_type as Profile['goalType'],
    targetCalories: row.target_calories as number,
    targetProtein: row.target_protein as number,
  };
}

// ── Body Stats ───────────────────────────────────────────────────────

export function bodyStatsToDb(entry: BodyStats, userId: string) {
  return {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    weight_kg: entry.weightKg,
    body_fat_percent: entry.bodyFatPercent ?? null,
  };
}

export function bodyStatsFromDb(row: Record<string, unknown>): BodyStats {
  return {
    id: row.id as string,
    date: row.date as string,
    weightKg: row.weight_kg as number,
    ...(row.body_fat_percent != null && { bodyFatPercent: row.body_fat_percent as number }),
  };
}

// ── Task ─────────────────────────────────────────────────────────────

export function taskToDb(task: Task, userId: string) {
  return {
    id: task.id,
    user_id: userId,
    date: task.date,
    time_block: task.timeBlock,
    title: task.title,
    priority: task.priority,
    completed: task.completed,
    notes: task.notes ?? null,
  };
}

export function taskFromDb(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    date: row.date as string,
    timeBlock: row.time_block as Task['timeBlock'],
    title: row.title as string,
    priority: row.priority as Task['priority'],
    completed: row.completed as boolean,
    ...(row.notes != null && { notes: row.notes as string }),
  };
}

// ── Workout Log ──────────────────────────────────────────────────────

export function workoutToDb(workout: WorkoutLog, userId: string) {
  return {
    id: workout.id,
    user_id: userId,
    date: workout.date,
    category: workout.category,
    title: workout.title,
    exercises: workout.exercises, // JSONB — pass through as-is
    duration_min: workout.durationMin,
    notes: workout.notes ?? null,
    completed: workout.completed,
  };
}

export function workoutFromDb(row: Record<string, unknown>): WorkoutLog {
  return {
    id: row.id as string,
    date: row.date as string,
    category: row.category as WorkoutLog['category'],
    title: row.title as string,
    exercises: row.exercises as WorkoutLog['exercises'],
    durationMin: row.duration_min as number,
    ...(row.notes != null && { notes: row.notes as string }),
    completed: row.completed as boolean,
  };
}

// ── Meal Assignment ──────────────────────────────────────────────────

export function mealAssignmentToDb(meal: MealAssignment, userId: string) {
  return {
    id: meal.id,
    user_id: userId,
    date: meal.date,
    slot: meal.slot,
    recipe_id: meal.recipeId,
    servings: meal.servings,
  };
}

export function mealAssignmentFromDb(row: Record<string, unknown>): MealAssignment {
  return {
    id: row.id as string,
    date: row.date as string,
    slot: row.slot as MealAssignment['slot'],
    recipeId: row.recipe_id as string,
    servings: row.servings as number,
  };
}

// ── Shopping Item ────────────────────────────────────────────────────

export function shoppingItemToDb(item: ShoppingItem, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    name: item.name,
    amount: item.amount ?? null,
    unit: item.unit ?? null,
    category: item.category,
    checked: item.checked,
    from_meal_plan: item.fromMealPlan,
  };
}

export function shoppingItemFromDb(row: Record<string, unknown>): ShoppingItem {
  return {
    id: row.id as string,
    name: row.name as string,
    ...(row.amount != null && { amount: row.amount as number }),
    ...(row.unit != null && { unit: row.unit as string }),
    category: row.category as string,
    checked: row.checked as boolean,
    fromMealPlan: row.from_meal_plan as boolean,
  };
}

// ── Habit ────────────────────────────────────────────────────────────

export function habitToDb(habit: Habit, userId: string) {
  return {
    id: habit.id,
    user_id: userId,
    name: habit.name,
    icon: habit.icon,
    color: habit.color,
    target_per_day: habit.targetPerDay,
  };
}

export function habitFromDb(row: Record<string, unknown>): Habit {
  return {
    id: row.id as string,
    name: row.name as string,
    icon: row.icon as string,
    color: row.color as string,
    targetPerDay: row.target_per_day as number,
  };
}

// ── Habit Log ────────────────────────────────────────────────────────

export function habitLogToDb(log: { habitId: string; date: string; completed: boolean }, userId: string) {
  return {
    user_id: userId,
    habit_id: log.habitId,
    date: log.date,
    completed: log.completed,
  };
}

export function habitLogFromDb(row: Record<string, unknown>): HabitLog {
  return {
    habitId: row.habit_id as string,
    date: row.date as string,
    completed: row.completed as boolean,
    ...(row.value != null && { value: row.value as number }),
  };
}

// ── Goal ─────────────────────────────────────────────────────────────

export function goalToDb(goal: Goal, userId: string) {
  return {
    id: goal.id,
    user_id: userId,
    title: goal.title,
    description: goal.description,
    category: goal.category,
    deadline: goal.deadline ?? null,
    milestones: goal.milestones, // JSONB — pass through as-is
  };
}

export function goalFromDb(row: Record<string, unknown>): Goal {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    category: row.category as Goal['category'],
    ...(row.deadline != null && { deadline: row.deadline as string }),
    milestones: row.milestones as Goal['milestones'],
  };
}

// ── XP Event (credits in DB) ─────────────────────────────────────────

export function xpEventToDb(event: XPEvent, userId: string) {
  return {
    id: event.id,
    user_id: userId,
    date: event.date,
    type: event.type,
    description: event.description,
    credits: event.xp,
  };
}

export function xpEventFromDb(row: Record<string, unknown>): XPEvent {
  return {
    id: row.id as string,
    date: row.date as string,
    type: row.type as XPEvent['type'],
    description: row.description as string,
    xp: row.credits as number,
  };
}

// ── Reward ───────────────────────────────────────────────────────────

export function rewardToDb(reward: Reward, userId: string) {
  return {
    id: reward.id,
    user_id: userId,
    name: reward.name,
    description: reward.description,
    icon: reward.icon,
    cost_credits: reward.costXP,
    unlocked: reward.unlocked,
  };
}

export function rewardFromDb(row: Record<string, unknown>): Reward {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    icon: row.icon as string,
    costXP: row.cost_credits as number,
    unlocked: row.unlocked as boolean,
  };
}
