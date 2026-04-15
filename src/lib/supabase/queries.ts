import type { SupabaseClient } from '@supabase/supabase-js';
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
import {
  profileToDb,
  profileFromDb,
  bodyStatsToDb,
  bodyStatsFromDb,
  taskToDb,
  taskFromDb,
  workoutToDb,
  workoutFromDb,
  mealAssignmentToDb,
  mealAssignmentFromDb,
  shoppingItemToDb,
  shoppingItemFromDb,
  habitToDb,
  habitFromDb,
  habitLogToDb,
  habitLogFromDb,
  goalToDb,
  goalFromDb,
  xpEventToDb,
  xpEventFromDb,
  rewardToDb,
  rewardFromDb,
} from './mappers';

// ── Profile ──────────────────────────────────────────────────────────

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      console.error('fetchProfile error:', error);
    }
    return null;
  }
  return profileFromDb(data);
}

export async function upsertProfile(
  supabase: SupabaseClient,
  userId: string,
  data: Partial<Profile>,
): Promise<void> {
  const row = profileToDb(data, userId);
  const { error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'user_id' });

  if (error) console.error('upsertProfile error:', error);
}

// ── Body Stats ───────────────────────────────────────────────────────

export async function fetchBodyStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<BodyStats[]> {
  const { data, error } = await supabase
    .from('body_stats')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchBodyStats error:', error);
    return [];
  }
  return (data ?? []).map(bodyStatsFromDb);
}

export async function insertBodyStats(
  supabase: SupabaseClient,
  userId: string,
  entry: BodyStats,
): Promise<void> {
  const row = bodyStatsToDb(entry, userId);
  const { error } = await supabase.from('body_stats').insert(row);

  if (error) console.error('insertBodyStats error:', error);
}

// ── Tasks ────────────────────────────────────────────────────────────

export async function fetchTasks(
  supabase: SupabaseClient,
  userId: string,
): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchTasks error:', error);
    return [];
  }
  return (data ?? []).map(taskFromDb);
}

export async function insertTask(
  supabase: SupabaseClient,
  userId: string,
  task: Task,
): Promise<void> {
  const row = taskToDb(task, userId);
  const { error } = await supabase.from('tasks').insert(row);

  if (error) console.error('insertTask error:', error);
}

export async function updateTask(
  supabase: SupabaseClient,
  userId: string,
  task: Task,
): Promise<void> {
  const row = taskToDb(task, userId);
  const { error } = await supabase
    .from('tasks')
    .update(row)
    .eq('id', task.id)
    .eq('user_id', userId);

  if (error) console.error('updateTask error:', error);
}

export async function deleteTask(
  supabase: SupabaseClient,
  userId: string,
  taskId: string,
): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId);

  if (error) console.error('deleteTask error:', error);
}

// ── Workouts ─────────────────────────────────────────────────────────

export async function fetchWorkouts(
  supabase: SupabaseClient,
  userId: string,
): Promise<WorkoutLog[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('fetchWorkouts error:', error);
    return [];
  }
  return (data ?? []).map(workoutFromDb);
}

export async function insertWorkout(
  supabase: SupabaseClient,
  userId: string,
  workout: WorkoutLog,
): Promise<void> {
  const row = workoutToDb(workout, userId);
  const { error } = await supabase.from('workouts').insert(row);

  if (error) console.error('insertWorkout error:', error);
}

export async function updateWorkout(
  supabase: SupabaseClient,
  userId: string,
  workout: WorkoutLog,
): Promise<void> {
  const row = workoutToDb(workout, userId);
  const { error } = await supabase
    .from('workouts')
    .update(row)
    .eq('id', workout.id)
    .eq('user_id', userId);

  if (error) console.error('updateWorkout error:', error);
}

export async function deleteWorkout(
  supabase: SupabaseClient,
  userId: string,
  workoutId: string,
): Promise<void> {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)
    .eq('user_id', userId);

  if (error) console.error('deleteWorkout error:', error);
}

// ── Meal Assignments ─────────────────────────────────────────────────

export async function fetchMealAssignments(
  supabase: SupabaseClient,
  userId: string,
): Promise<MealAssignment[]> {
  const { data, error } = await supabase
    .from('meal_assignments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchMealAssignments error:', error);
    return [];
  }
  return (data ?? []).map(mealAssignmentFromDb);
}

export async function insertMealAssignment(
  supabase: SupabaseClient,
  userId: string,
  meal: MealAssignment,
): Promise<void> {
  const row = mealAssignmentToDb(meal, userId);
  const { error } = await supabase.from('meal_assignments').insert(row);

  if (error) console.error('insertMealAssignment error:', error);
}

export async function deleteMealAssignment(
  supabase: SupabaseClient,
  userId: string,
  mealId: string,
): Promise<void> {
  const { error } = await supabase
    .from('meal_assignments')
    .delete()
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) console.error('deleteMealAssignment error:', error);
}

// ── Shopping Items ───────────────────────────────────────────────────

export async function fetchShoppingItems(
  supabase: SupabaseClient,
  userId: string,
): Promise<ShoppingItem[]> {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('fetchShoppingItems error:', error);
    return [];
  }
  return (data ?? []).map(shoppingItemFromDb);
}

export async function insertShoppingItem(
  supabase: SupabaseClient,
  userId: string,
  item: ShoppingItem,
): Promise<void> {
  const row = shoppingItemToDb(item, userId);
  const { error } = await supabase.from('shopping_items').insert(row);

  if (error) console.error('insertShoppingItem error:', error);
}

export async function updateShoppingItem(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  updates: Partial<ShoppingItem>,
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
  if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.checked !== undefined) dbUpdates.checked = updates.checked;
  if (updates.fromMealPlan !== undefined) dbUpdates.from_meal_plan = updates.fromMealPlan;

  const { error } = await supabase
    .from('shopping_items')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', userId);

  if (error) console.error('updateShoppingItem error:', error);
}

export async function deleteShoppingItem(
  supabase: SupabaseClient,
  userId: string,
  itemId: string,
): Promise<void> {
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId);

  if (error) console.error('deleteShoppingItem error:', error);
}

export async function replaceShoppingList(
  supabase: SupabaseClient,
  userId: string,
  items: ShoppingItem[],
): Promise<void> {
  // Delete all existing items for this user, then insert the new list
  const { error: deleteError } = await supabase
    .from('shopping_items')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('replaceShoppingList delete error:', deleteError);
    return;
  }

  if (items.length === 0) return;

  const rows = items.map((item) => shoppingItemToDb(item, userId));
  const { error: insertError } = await supabase
    .from('shopping_items')
    .insert(rows);

  if (insertError) console.error('replaceShoppingList insert error:', insertError);
}

// ── Habits ───────────────────────────────────────────────────────────

export async function fetchHabits(
  supabase: SupabaseClient,
  userId: string,
): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('fetchHabits error:', error);
    return [];
  }
  return (data ?? []).map(habitFromDb);
}

export async function insertHabit(
  supabase: SupabaseClient,
  userId: string,
  habit: Habit,
): Promise<void> {
  const row = habitToDb(habit, userId);
  const { error } = await supabase.from('habits').insert(row);

  if (error) console.error('insertHabit error:', error);
}

export async function deleteHabit(
  supabase: SupabaseClient,
  userId: string,
  habitId: string,
): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId);

  if (error) console.error('deleteHabit error:', error);
}

// ── Habit Logs ───────────────────────────────────────────────────────

export async function fetchHabitLogs(
  supabase: SupabaseClient,
  userId: string,
): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('fetchHabitLogs error:', error);
    return [];
  }
  return (data ?? []).map(habitLogFromDb);
}

export async function upsertHabitLog(
  supabase: SupabaseClient,
  userId: string,
  log: { habitId: string; date: string; completed: boolean },
): Promise<void> {
  const row = habitLogToDb(log, userId);
  const { error } = await supabase
    .from('habit_logs')
    .upsert(row, { onConflict: 'user_id,habit_id,date' });

  if (error) console.error('upsertHabitLog error:', error);
}

// ── Goals ────────────────────────────────────────────────────────────

export async function fetchGoals(
  supabase: SupabaseClient,
  userId: string,
): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('fetchGoals error:', error);
    return [];
  }
  return (data ?? []).map(goalFromDb);
}

export async function insertGoal(
  supabase: SupabaseClient,
  userId: string,
  goal: Goal,
): Promise<void> {
  const row = goalToDb(goal, userId);
  const { error } = await supabase.from('goals').insert(row);

  if (error) console.error('insertGoal error:', error);
}

export async function updateGoal(
  supabase: SupabaseClient,
  userId: string,
  goal: Goal,
): Promise<void> {
  const row = goalToDb(goal, userId);
  const { error } = await supabase
    .from('goals')
    .update(row)
    .eq('id', goal.id)
    .eq('user_id', userId);

  if (error) console.error('updateGoal error:', error);
}

export async function deleteGoal(
  supabase: SupabaseClient,
  userId: string,
  goalId: string,
): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) console.error('deleteGoal error:', error);
}

// ── XP / Credit Events ──────────────────────────────────────────────

export async function fetchXPEvents(
  supabase: SupabaseClient,
  userId: string,
): Promise<XPEvent[]> {
  const { data, error } = await supabase
    .from('xp_events')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('fetchXPEvents error:', error);
    return [];
  }
  return (data ?? []).map(xpEventFromDb);
}

export async function insertXPEvent(
  supabase: SupabaseClient,
  userId: string,
  event: XPEvent,
): Promise<void> {
  const row = xpEventToDb(event, userId);
  const { error } = await supabase.from('xp_events').insert(row);

  if (error) console.error('insertXPEvent error:', error);
}

// ── Rewards ──────────────────────────────────────────────────────────

export async function fetchRewards(
  supabase: SupabaseClient,
  userId: string,
): Promise<Reward[]> {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('fetchRewards error:', error);
    return [];
  }
  return (data ?? []).map(rewardFromDb);
}

export async function insertRewards(
  supabase: SupabaseClient,
  userId: string,
  rewards: Reward[],
): Promise<void> {
  if (rewards.length === 0) return;

  const rows = rewards.map((r) => rewardToDb(r, userId));
  const { error } = await supabase.from('rewards').insert(rows);

  if (error) console.error('insertRewards error:', error);
}

export async function updateReward(
  supabase: SupabaseClient,
  userId: string,
  rewardId: string,
  updates: Partial<Reward>,
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
  if (updates.costXP !== undefined) dbUpdates.cost_credits = updates.costXP;
  if (updates.unlocked !== undefined) dbUpdates.unlocked = updates.unlocked;

  const { error } = await supabase
    .from('rewards')
    .update(dbUpdates)
    .eq('id', rewardId)
    .eq('user_id', userId);

  if (error) console.error('updateReward error:', error);
}
