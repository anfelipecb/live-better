'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { AppState, AppAction } from '@/types';
import { exercises } from '@/data/exercises';
import { recipes } from '@/data/recipes';
import { sampleHabits } from '@/data/sampleHabits';
import { sampleGoals } from '@/data/sampleGoals';

// ── Initial State ─────────────────────────────────────────────────────

const initialState: AppState = {
  profile: {
    name: 'Felipe',
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
  habits: sampleHabits,
  habitLogs: [],
  goals: sampleGoals,
};

// ── Reducer ───────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
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

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
