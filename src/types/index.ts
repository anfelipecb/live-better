// ── Profile & Body Stats ──────────────────────────────────────────────

export interface Profile {
  name: string;
  age: number;
  heightCm: number;
  goalType: 'recomp' | 'cut' | 'bulk' | 'maintain';
  targetCalories: number;
  targetProtein: number;
}

export interface BodyStats {
  id: string;
  date: string; // 'YYYY-MM-DD'
  weightKg: number;
  bodyFatPercent?: number;
}

// ── Day Planner ───────────────────────────────────────────────────────

export type TimeBlock = 'morning' | 'afternoon' | 'evening';
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  date: string;
  timeBlock: TimeBlock;
  title: string;
  priority: Priority;
  completed: boolean;
  notes?: string;
}

// ── Workouts ──────────────────────────────────────────────────────────

export type WorkoutCategory = 'strength' | 'cycling' | 'yoga' | 'rest';

export interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  muscleGroup: string;
  equipment: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps?: number;
  weightKg?: number;
  durationMin?: number;
  distanceKm?: number;
  notes?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: ExerciseSet[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  category: WorkoutCategory;
  title: string;
  exercises: WorkoutExercise[];
  durationMin: number;
  notes?: string;
  completed: boolean;
}

// ── Meals & Recipes ───────────────────────────────────────────────────

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: string; // 'protein' | 'produce' | 'dairy' | 'grains' | 'pantry' | 'spices'
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: MealSlot;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  macros: Macros;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  imageEmoji: string;
}

export interface MealAssignment {
  id: string;
  date: string;
  slot: MealSlot;
  recipeId: string;
  servings: number;
}

// ── Shopping List ─────────────────────────────────────────────────────

export interface ShoppingItem {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  category: string;
  checked: boolean;
  fromMealPlan: boolean;
}

// ── Habits & Goals ────────────────────────────────────────────────────

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  targetPerDay: number;
}

export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number;
}

export interface Milestone {
  id: string;
  title: string;
  deadline?: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'career' | 'fitness' | 'personal';
  deadline?: string;
  milestones: Milestone[];
}

// ── App State ─────────────────────────────────────────────────────────

export interface AppState {
  profile: Profile;
  bodyStats: BodyStats[];
  tasks: Task[];
  exercises: Exercise[];
  workouts: WorkoutLog[];
  recipes: Recipe[];
  mealAssignments: MealAssignment[];
  shoppingList: ShoppingItem[];
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
}

// ── Reducer Actions ───────────────────────────────────────────────────

export type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'ADD_WORKOUT'; payload: WorkoutLog }
  | { type: 'UPDATE_WORKOUT'; payload: WorkoutLog }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_BODY_STATS'; payload: BodyStats }
  | { type: 'ASSIGN_MEAL'; payload: MealAssignment }
  | { type: 'REMOVE_MEAL'; payload: string }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'GENERATE_SHOPPING_LIST'; payload: ShoppingItem[] }
  | { type: 'ADD_SHOPPING_ITEM'; payload: ShoppingItem }
  | { type: 'TOGGLE_SHOPPING_ITEM'; payload: string }
  | { type: 'CLEAR_CHECKED_ITEMS' }
  | { type: 'TOGGLE_HABIT'; payload: { habitId: string; date: string } }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'TOGGLE_MILESTONE'; payload: { goalId: string; milestoneId: string } }
  | { type: 'UPDATE_PROFILE'; payload: Partial<Profile> };
