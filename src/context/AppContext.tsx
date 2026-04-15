'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type Dispatch,
} from 'react';
import { useUser, useSession } from '@clerk/nextjs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AppState, AppAction, Reward } from '@/types';
import { exercises } from '@/data/exercises';
import { recipes } from '@/data/recipes';
import { sampleHabits } from '@/data/sampleHabits';
import { sampleGoals } from '@/data/sampleGoals';
import {
  fetchProfile,
  fetchBodyStats,
  fetchTasks,
  fetchWorkouts,
  fetchMealAssignments,
  fetchShoppingItems,
  fetchHabits,
  fetchHabitLogs,
  fetchGoals,
  fetchXPEvents,
  fetchRewards,
  upsertProfile,
  insertRewards,
  insertHabit,
} from '@/lib/supabase/queries';
import { persistAction } from '@/lib/supabase/persist';

// ── Default Rewards ──────────────────────────────────────────────────

const defaultRewards: Reward[] = [
  { id: 'r1', name: 'Order Delivery', description: 'Allow yourself to order food delivery once', icon: '🍔', costXP: 200, unlocked: false },
  { id: 'r2', name: 'Rest Day Pass', description: 'Take an extra rest day guilt-free', icon: '😴', costXP: 150, unlocked: false },
  { id: 'r3', name: 'Cheat Meal', description: 'Enjoy a cheat meal without tracking', icon: '🍕', costXP: 300, unlocked: false },
  { id: 'r4', name: 'Gaming Session', description: '2 hours of guilt-free gaming', icon: '🎮', costXP: 100, unlocked: false },
  { id: 'r5', name: 'Movie Night', description: 'Skip evening routine for a movie', icon: '🎬', costXP: 120, unlocked: false },
  { id: 'r6', name: 'Weekend Trip', description: 'A weekend trip as a reward for consistency', icon: '✈️', costXP: 1000, unlocked: false },
];

// ── Initial State (used before Supabase loads) ───────────────────────

const initialState: AppState = {
  profile: {
    name: '',
    age: 25,
    heightCm: 178,
    goalType: 'recomp',
    targetCalories: 2200,
    targetProtein: 180,
  },
  bodyStats: [],
  tasks: [],
  exercises,
  workouts: [],
  recipes,
  mealAssignments: [],
  shoppingList: [],
  habits: [],
  habitLogs: [],
  goals: [],
  xpEvents: [],
  totalXP: 0,
  rewards: [],
};

// ── Reducer ───────────────────────────────────────────────────────────

type InternalAction = AppAction | { type: 'LOAD_STATE'; payload: AppState };

function appReducer(state: AppState, action: InternalAction): AppState {
  switch (action.type) {
    // ── Hydrate from Supabase ───────────────────────────────────
    case 'LOAD_STATE':
      return action.payload;

    // ── Tasks ──────────────────────────────────────────────────────
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
      };

    // ── Workouts ───────────────────────────────────────────────────
    case 'ADD_WORKOUT':
      return { ...state, workouts: [...state.workouts, action.payload] };

    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.payload.id ? action.payload : w,
        ),
      };

    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.payload),
      };

    // ── Body Stats ─────────────────────────────────────────────────
    case 'ADD_BODY_STATS':
      return { ...state, bodyStats: [...state.bodyStats, action.payload] };

    // ── Meals ──────────────────────────────────────────────────────
    case 'ASSIGN_MEAL':
      return {
        ...state,
        mealAssignments: [...state.mealAssignments, action.payload],
      };

    case 'REMOVE_MEAL':
      return {
        ...state,
        mealAssignments: state.mealAssignments.filter(
          (m) => m.id !== action.payload,
        ),
      };

    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };

    // ── Shopping List ──────────────────────────────────────────────
    case 'GENERATE_SHOPPING_LIST':
      return { ...state, shoppingList: action.payload };

    case 'ADD_SHOPPING_ITEM':
      return {
        ...state,
        shoppingList: [...state.shoppingList, action.payload],
      };

    case 'TOGGLE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingList: state.shoppingList.map((item) =>
          item.id === action.payload
            ? { ...item, checked: !item.checked }
            : item,
        ),
      };

    case 'CLEAR_CHECKED_ITEMS':
      return {
        ...state,
        shoppingList: state.shoppingList.filter((item) => !item.checked),
      };

    // ── Habits ─────────────────────────────────────────────────────
    case 'TOGGLE_HABIT': {
      const { habitId, date } = action.payload;
      const existing = state.habitLogs.find(
        (log) => log.habitId === habitId && log.date === date,
      );

      if (existing) {
        return {
          ...state,
          habitLogs: state.habitLogs.map((log) =>
            log.habitId === habitId && log.date === date
              ? { ...log, completed: !log.completed }
              : log,
          ),
        };
      }

      return {
        ...state,
        habitLogs: [
          ...state.habitLogs,
          { habitId, date, completed: true },
        ],
      };
    }

    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };

    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
        habitLogs: state.habitLogs.filter(
          (log) => log.habitId !== action.payload,
        ),
      };

    // ── Goals ──────────────────────────────────────────────────────
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? action.payload : g,
        ),
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
      };

    case 'TOGGLE_MILESTONE':
      return {
        ...state,
        goals: state.goals.map((g) => {
          if (g.id !== action.payload.goalId) return g;
          return {
            ...g,
            milestones: g.milestones.map((m) =>
              m.id === action.payload.milestoneId
                ? { ...m, completed: !m.completed }
                : m,
            ),
          };
        }),
      };

    // ── Profile ────────────────────────────────────────────────────
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };

    // ── Gamification ──────────────────────────────────────────────
    case 'ADD_XP':
      return {
        ...state,
        xpEvents: [...state.xpEvents, action.payload],
        totalXP: state.totalXP + action.payload.xp,
      };

    case 'UNLOCK_REWARD': {
      const reward = state.rewards.find((r) => r.id === action.payload);
      if (!reward || reward.unlocked) return state;
      return {
        ...state,
        totalXP: state.totalXP - reward.costXP,
        rewards: state.rewards.map((r) =>
          r.id === action.payload ? { ...r, unlocked: true } : r,
        ),
      };
    }

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  const { user, isLoaded: userLoaded } = useUser();
  const { session } = useSession();

  const userId = user?.id ?? null;

  // ── Create Supabase client when session is available ──────────
  useEffect(() => {
    if (!session) {
      setSupabase(null);
      return;
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session.getToken({
              template: 'supabase',
            });
            const headers = new Headers(options?.headers);
            if (clerkToken) {
              headers.set('Authorization', `Bearer ${clerkToken}`);
            }
            return fetch(url, { ...options, headers });
          },
        },
      },
    );

    setSupabase(client);
  }, [session]);

  // ── Load data from Supabase on mount ──────────────────────────
  useEffect(() => {
    if (!userLoaded) return;

    // Not signed in — use default state
    if (!userId || !supabase) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        const [
          profile,
          bodyStats,
          tasks,
          workouts,
          mealAssignments,
          shoppingItems,
          habits,
          habitLogs,
          goals,
          xpEvents,
          rewards,
        ] = await Promise.all([
          fetchProfile(supabase!, userId!),
          fetchBodyStats(supabase!, userId!),
          fetchTasks(supabase!, userId!),
          fetchWorkouts(supabase!, userId!),
          fetchMealAssignments(supabase!, userId!),
          fetchShoppingItems(supabase!, userId!),
          fetchHabits(supabase!, userId!),
          fetchHabitLogs(supabase!, userId!),
          fetchGoals(supabase!, userId!),
          fetchXPEvents(supabase!, userId!),
          fetchRewards(supabase!, userId!),
        ]);

        if (cancelled) return;

        // First-time user: create profile + seed data
        const isNewUser = !profile;

        if (isNewUser) {
          const defaultProfile = {
            name: user?.firstName || 'User',
            age: 25,
            heightCm: 178,
            goalType: 'recomp' as const,
            targetCalories: 2200,
            targetProtein: 180,
          };

          await upsertProfile(supabase!, userId!, defaultProfile);
          await insertRewards(supabase!, userId!, defaultRewards);

          // Seed default habits
          for (const h of sampleHabits) {
            await insertHabit(supabase!, userId!, h);
          }

          // Reload after seeding
          const [seededHabits, seededRewards] = await Promise.all([
            fetchHabits(supabase!, userId!),
            fetchRewards(supabase!, userId!),
          ]);

          if (cancelled) return;

          rawDispatch({
            type: 'LOAD_STATE',
            payload: {
              profile: defaultProfile,
              bodyStats: [],
              tasks: [],
              exercises,
              workouts: [],
              recipes,
              mealAssignments: [],
              shoppingList: [],
              habits: seededHabits,
              habitLogs: [],
              goals: sampleGoals,
              xpEvents: [],
              totalXP: 0,
              rewards: seededRewards,
            },
          });
        } else {
          // Existing user: load all data
          const totalXP = xpEvents.reduce((sum, e) => sum + e.xp, 0);

          rawDispatch({
            type: 'LOAD_STATE',
            payload: {
              profile,
              bodyStats,
              tasks,
              exercises,
              workouts,
              recipes,
              mealAssignments,
              shoppingList: shoppingItems,
              habits: habits.length > 0 ? habits : sampleHabits,
              habitLogs,
              goals: goals.length > 0 ? goals : sampleGoals,
              xpEvents,
              totalXP,
              rewards: rewards.length > 0 ? rewards : defaultRewards,
            },
          });
        }
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [userId, userLoaded, supabase, user?.firstName]);

  // ── Persisting dispatch ─────────────────────────────────────────
  const dispatch = useCallback(
    (action: AppAction) => {
      // Optimistic: update UI immediately
      rawDispatch(action);

      // Fire-and-forget: persist to Supabase
      if (supabase && userId) {
        // We need the NEW state after this action, but useReducer
        // hasn't updated yet. We compute it by running the reducer
        // manually on the current state snapshot.
        const nextState = appReducer(state, action);
        persistAction(supabase, userId, action, nextState).catch((err) =>
          console.error('Persist failed:', err),
        );
      }
    },
    [supabase, userId, state],
  );

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
