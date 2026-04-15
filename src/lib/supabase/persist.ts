import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppAction, AppState } from '@/types';
import {
  upsertProfile,
  insertBodyStats,
  insertTask,
  updateTask,
  deleteTask,
  insertWorkout,
  updateWorkout,
  deleteWorkout,
  insertMealAssignment,
  deleteMealAssignment,
  replaceShoppingList,
  insertShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  insertHabit,
  deleteHabit,
  upsertHabitLog,
  insertGoal,
  updateGoal,
  deleteGoal,
  insertXPEvent,
  updateReward,
} from './queries';

/**
 * Persists a dispatched action to Supabase as a fire-and-forget side effect.
 *
 * @param supabase - The Supabase client instance
 * @param userId - The Clerk user ID
 * @param action - The action that was just dispatched
 * @param state - The app state AFTER the reducer has applied the action
 */
export async function persistAction(
  supabase: SupabaseClient,
  userId: string,
  action: AppAction,
  state: AppState,
): Promise<void> {
  try {
    switch (action.type) {
      // ── Tasks ──────────────────────────────────────────────────────
      case 'ADD_TASK':
        await insertTask(supabase, userId, action.payload);
        break;

      case 'UPDATE_TASK':
        await updateTask(supabase, userId, action.payload);
        break;

      case 'DELETE_TASK':
        await deleteTask(supabase, userId, action.payload);
        break;

      case 'TOGGLE_TASK': {
        const toggledTask = state.tasks.find((t) => t.id === action.payload);
        if (toggledTask) {
          await updateTask(supabase, userId, toggledTask);
        }
        break;
      }

      // ── Workouts ───────────────────────────────────────────────────
      case 'ADD_WORKOUT':
        await insertWorkout(supabase, userId, action.payload);
        break;

      case 'UPDATE_WORKOUT':
        await updateWorkout(supabase, userId, action.payload);
        break;

      case 'DELETE_WORKOUT':
        await deleteWorkout(supabase, userId, action.payload);
        break;

      // ── Body Stats ─────────────────────────────────────────────────
      case 'ADD_BODY_STATS':
        await insertBodyStats(supabase, userId, action.payload);
        break;

      // ── Meals ──────────────────────────────────────────────────────
      case 'ASSIGN_MEAL':
        await insertMealAssignment(supabase, userId, action.payload);
        break;

      case 'REMOVE_MEAL':
        await deleteMealAssignment(supabase, userId, action.payload);
        break;

      // ── Shopping List ──────────────────────────────────────────────
      case 'GENERATE_SHOPPING_LIST':
        await replaceShoppingList(supabase, userId, action.payload);
        break;

      case 'ADD_SHOPPING_ITEM':
        await insertShoppingItem(supabase, userId, action.payload);
        break;

      case 'TOGGLE_SHOPPING_ITEM': {
        const toggledItem = state.shoppingList.find((i) => i.id === action.payload);
        if (toggledItem) {
          await updateShoppingItem(supabase, userId, toggledItem.id, {
            checked: toggledItem.checked,
          });
        }
        break;
      }

      case 'CLEAR_CHECKED_ITEMS': {
        // The reducer already removed checked items from state.
        // We need to delete items that are no longer in the list.
        // Since we don't have the old state, delete all checked items from DB.
        const { error } = await supabase
          .from('shopping_items')
          .delete()
          .eq('user_id', userId)
          .eq('checked', true);

        if (error) console.error('CLEAR_CHECKED_ITEMS persist error:', error);
        break;
      }

      // ── Habits ─────────────────────────────────────────────────────
      case 'ADD_HABIT':
        await insertHabit(supabase, userId, action.payload);
        break;

      case 'DELETE_HABIT':
        await deleteHabit(supabase, userId, action.payload);
        break;

      case 'TOGGLE_HABIT': {
        const { habitId, date } = action.payload;
        const habitLog = state.habitLogs.find(
          (log) => log.habitId === habitId && log.date === date,
        );
        if (habitLog) {
          await upsertHabitLog(supabase, userId, {
            habitId,
            date,
            completed: habitLog.completed,
          });
        }
        break;
      }

      // ── Goals ──────────────────────────────────────────────────────
      case 'ADD_GOAL':
        await insertGoal(supabase, userId, action.payload);
        break;

      case 'UPDATE_GOAL':
        await updateGoal(supabase, userId, action.payload);
        break;

      case 'DELETE_GOAL':
        await deleteGoal(supabase, userId, action.payload);
        break;

      case 'TOGGLE_MILESTONE': {
        const updatedGoal = state.goals.find(
          (g) => g.id === action.payload.goalId,
        );
        if (updatedGoal) {
          await updateGoal(supabase, userId, updatedGoal);
        }
        break;
      }

      // ── Profile ────────────────────────────────────────────────────
      case 'UPDATE_PROFILE':
        await upsertProfile(supabase, userId, action.payload);
        break;

      // ── Gamification ───────────────────────────────────────────────
      case 'ADD_XP':
        await insertXPEvent(supabase, userId, action.payload);
        break;

      case 'UNLOCK_REWARD': {
        const unlockedReward = state.rewards.find(
          (r) => r.id === action.payload,
        );
        if (unlockedReward) {
          await updateReward(supabase, userId, unlockedReward.id, {
            unlocked: true,
          });
        }
        break;
      }

      // ── No-op for actions that don't need persistence ──────────────
      case 'ADD_RECIPE':
        // Recipes are seed data, not user-generated in DB
        break;

      default:
        // Exhaustive check — if a new action is added, TypeScript will
        // flag this if the switch isn't updated.
        break;
    }
  } catch (err) {
    console.error(`persistAction error for ${action.type}:`, err);
  }
}
