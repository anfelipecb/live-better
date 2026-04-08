'use client';

import { useApp } from '@/context/AppContext';
import { getToday } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import { UtensilsCrossed } from 'lucide-react';
import type { MealSlot } from '@/types';

const mealSlots: { slot: MealSlot; label: string }[] = [
  { slot: 'breakfast', label: 'Breakfast' },
  { slot: 'lunch', label: 'Lunch' },
  { slot: 'dinner', label: 'Dinner' },
  { slot: 'snack', label: 'Snack' },
];

export default function TodayMeals() {
  const { state } = useApp();
  const today = getToday();

  const todayAssignments = state.mealAssignments.filter((m) => m.date === today);

  // Build a map of slot -> recipe
  const slotRecipeMap = new Map<MealSlot, { recipeName: string; calories: number; protein: number; carbs: number; fat: number }>();

  for (const assignment of todayAssignments) {
    const recipe = state.recipes.find((r) => r.id === assignment.recipeId);
    if (recipe) {
      slotRecipeMap.set(assignment.slot, {
        recipeName: recipe.name,
        calories: recipe.calories * assignment.servings,
        protein: recipe.macros.protein * assignment.servings,
        carbs: recipe.macros.carbs * assignment.servings,
        fat: recipe.macros.fat * assignment.servings,
      });
    }
  }

  // Calculate totals
  const totals = Array.from(slotRecipeMap.values()).reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const hasAnyMeals = slotRecipeMap.size > 0;

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-dark-300 uppercase tracking-wider">
          Today&apos;s Meals
        </h3>
        <UtensilsCrossed className="text-dark-400" size={18} />
      </div>

      <div className="flex flex-col gap-2">
        {mealSlots.map(({ slot, label }) => {
          const meal = slotRecipeMap.get(slot);
          return (
            <div key={slot} className="flex items-center justify-between py-1">
              <span className="text-sm text-dark-300">{label}</span>
              {meal ? (
                <span className="text-sm text-dark-100 font-medium">
                  {meal.recipeName}
                </span>
              ) : (
                <span className="text-sm text-dark-500 italic">Not planned</span>
              )}
            </div>
          );
        })}
      </div>

      {hasAnyMeals && (
        <div className="border-t border-dark-600/50 pt-3 mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-300">Total</span>
            <span className="text-sm text-dark-100 font-semibold">
              {Math.round(totals.calories)} cal
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-dark-400">
            <span>P: {Math.round(totals.protein)}g</span>
            <span>C: {Math.round(totals.carbs)}g</span>
            <span>F: {Math.round(totals.fat)}g</span>
          </div>
        </div>
      )}

      {!hasAnyMeals && (
        <p className="text-dark-500 text-xs text-center">
          No meals planned for today.
        </p>
      )}
    </GlassCard>
  );
}
