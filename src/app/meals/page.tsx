'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import MealSlotCell from '@/components/meals/MealSlot';
import RecipePicker from '@/components/meals/RecipePicker';
import { generateId, getToday, getWeekDates, getDayName, formatDate } from '@/lib/utils';
import type { MealSlot } from '@/types';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';

const mealSlots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const slotLabels: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export default function MealsPage() {
  const { state, dispatch } = useApp();
  const [weekAnchor, setWeekAnchor] = useState(getToday());
  const [mobileDay, setMobileDay] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    date: string;
    slot: MealSlot;
  } | null>(null);

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);

  // Navigate weeks
  function prevWeek() {
    const d = new Date(weekAnchor + 'T12:00:00');
    d.setDate(d.getDate() - 7);
    setWeekAnchor(formatDate(d));
  }
  function nextWeek() {
    const d = new Date(weekAnchor + 'T12:00:00');
    d.setDate(d.getDate() + 7);
    setWeekAnchor(formatDate(d));
  }
  function goThisWeek() {
    setWeekAnchor(getToday());
    setMobileDay(0);
  }

  // Get assignment for a date + slot
  function getAssignment(date: string, slot: MealSlot) {
    return state.mealAssignments.find(
      (m) => m.date === date && m.slot === slot,
    );
  }

  // Get recipe by id
  function getRecipe(recipeId: string) {
    return state.recipes.find((r) => r.id === recipeId);
  }

  // Open picker for a specific cell
  function openPicker(date: string, slot: MealSlot) {
    setPickerTarget({ date, slot });
    setPickerOpen(true);
  }

  // Assign a recipe from picker
  function handlePickRecipe(recipeId: string) {
    if (!pickerTarget) return;
    const recipe = getRecipe(recipeId);
    dispatch({
      type: 'ASSIGN_MEAL',
      payload: {
        id: generateId(),
        date: pickerTarget.date,
        slot: pickerTarget.slot,
        recipeId,
        servings: recipe?.servings ?? 1,
      },
    });
    setPickerOpen(false);
    setPickerTarget(null);
  }

  // Remove assignment
  function removeAssignment(assignmentId: string) {
    dispatch({ type: 'REMOVE_MEAL', payload: assignmentId });
  }

  // Daily totals
  function getDayTotals(date: string) {
    const assignments = state.mealAssignments.filter((m) => m.date === date);
    let calories = 0,
      protein = 0,
      carbs = 0,
      fat = 0;
    for (const a of assignments) {
      const recipe = getRecipe(a.recipeId);
      if (recipe) {
        calories += recipe.calories;
        protein += recipe.macros.protein;
        carbs += recipe.macros.carbs;
        fat += recipe.macros.fat;
      }
    }
    return { calories, protein, carbs, fat };
  }

  // Weekly summary
  const weeklySummary = useMemo(() => {
    let totalCalories = 0,
      totalProtein = 0,
      totalCarbs = 0,
      totalFat = 0;
    let daysWithMeals = 0;
    for (const date of weekDates) {
      const totals = getDayTotals(date);
      if (totals.calories > 0) {
        daysWithMeals++;
        totalCalories += totals.calories;
        totalProtein += totals.protein;
        totalCarbs += totals.carbs;
        totalFat += totals.fat;
      }
    }
    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      daysWithMeals,
      avgCalories: daysWithMeals > 0 ? Math.round(totalCalories / daysWithMeals) : 0,
      avgProtein: daysWithMeals > 0 ? Math.round(totalProtein / daysWithMeals) : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekDates, state.mealAssignments]);

  // Short day names
  function shortDay(date: string) {
    return getDayName(date).slice(0, 3);
  }
  function dayNum(date: string) {
    return new Date(date + 'T12:00:00').getDate();
  }

  const today = getToday();

  return (
    <PageContainer>
      <Header
        title="Meal Planner"
        subtitle="Plan your weekly meals"
        action={
          <Button variant="ghost" size="sm" onClick={goThisWeek}>
            This Week
          </Button>
        }
      />

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevWeek}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-dark-300" />
        </button>
        <span className="text-sm text-dark-200 font-medium">
          {new Date(weekDates[0] + 'T12:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          &ndash;{' '}
          {new Date(weekDates[6] + 'T12:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <button
          onClick={nextWeek}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-dark-300" />
        </button>
      </div>

      {/* Mobile day picker */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 md:hidden">
        {weekDates.map((date, i) => (
          <button
            key={date}
            onClick={() => setMobileDay(i)}
            className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              mobileDay === i
                ? 'bg-accent text-white'
                : date === today
                  ? 'glass text-accent'
                  : 'glass text-dark-300'
            }`}
          >
            <span>{shortDay(date)}</span>
            <span className="text-sm font-bold">{dayNum(date)}</span>
          </button>
        ))}
      </div>

      {/* Desktop grid: 7 columns */}
      <div className="hidden md:block mb-6">
        <GlassCard className="!p-3 overflow-x-auto">
          <table className="w-full table-fixed min-w-[700px]">
            <thead>
              <tr>
                <th className="w-20 text-left text-xs text-dark-400 font-medium pb-3 pl-1">
                  Slot
                </th>
                {weekDates.map((date) => (
                  <th
                    key={date}
                    className={`text-center text-xs font-medium pb-3 ${
                      date === today ? 'text-accent' : 'text-dark-400'
                    }`}
                  >
                    <div>{shortDay(date)}</div>
                    <div className="text-sm font-bold text-dark-200">
                      {dayNum(date)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealSlots.map((slot) => (
                <tr key={slot}>
                  <td className="py-1.5 pl-1 text-xs text-dark-300 font-medium capitalize align-top pt-3">
                    {slotLabels[slot]}
                  </td>
                  {weekDates.map((date) => {
                    const assignment = getAssignment(date, slot);
                    const recipe = assignment
                      ? getRecipe(assignment.recipeId)
                      : undefined;
                    return (
                      <td key={date} className="p-1 align-top">
                        <MealSlotCell
                          date={date}
                          slot={slot}
                          assignment={assignment}
                          recipe={recipe}
                          onAssign={() => openPicker(date, slot)}
                          onRemove={() =>
                            assignment && removeAssignment(assignment.id)
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Daily totals row */}
              <tr className="border-t border-dark-700">
                <td className="py-2 pl-1 text-xs text-dark-400 font-medium pt-3">
                  Totals
                </td>
                {weekDates.map((date) => {
                  const totals = getDayTotals(date);
                  return (
                    <td key={date} className="p-1 pt-3 text-center">
                      {totals.calories > 0 ? (
                        <div className="text-xs space-y-0.5">
                          <div className="text-dark-100 font-semibold flex items-center justify-center gap-0.5">
                            <Flame className="w-3 h-3 text-orange-400" />
                            {totals.calories}
                          </div>
                          <div className="text-dark-400">
                            P:{totals.protein}g
                          </div>
                          <div className="text-dark-400">
                            C:{totals.carbs}g
                          </div>
                          <div className="text-dark-400">
                            F:{totals.fat}g
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-dark-600">&mdash;</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </GlassCard>
      </div>

      {/* Mobile single-day view */}
      <div className="md:hidden space-y-3 mb-6">
        {mealSlots.map((slot) => {
          const date = weekDates[mobileDay];
          const assignment = getAssignment(date, slot);
          const recipe = assignment
            ? getRecipe(assignment.recipeId)
            : undefined;
          return (
            <div key={slot}>
              <p className="text-xs text-dark-400 font-medium uppercase tracking-wider mb-1.5">
                {slotLabels[slot]}
              </p>
              <MealSlotCell
                date={date}
                slot={slot}
                assignment={assignment}
                recipe={recipe}
                onAssign={() => openPicker(date, slot)}
                onRemove={() =>
                  assignment && removeAssignment(assignment.id)
                }
              />
            </div>
          );
        })}

        {/* Mobile day totals */}
        {(() => {
          const totals = getDayTotals(weekDates[mobileDay]);
          if (totals.calories === 0) return null;
          return (
            <GlassCard className="!p-4">
              <p className="text-xs text-dark-400 font-medium mb-2">
                Day Totals
              </p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div>
                  <p className="text-dark-100 font-semibold">
                    {totals.calories}
                  </p>
                  <p className="text-dark-400">kcal</p>
                </div>
                <div>
                  <p className="text-blue-400 font-semibold">
                    {totals.protein}g
                  </p>
                  <p className="text-dark-400">Protein</p>
                </div>
                <div>
                  <p className="text-amber-400 font-semibold">
                    {totals.carbs}g
                  </p>
                  <p className="text-dark-400">Carbs</p>
                </div>
                <div>
                  <p className="text-pink-400 font-semibold">{totals.fat}g</p>
                  <p className="text-dark-400">Fat</p>
                </div>
              </div>
            </GlassCard>
          );
        })()}
      </div>

      {/* Weekly summary */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-dark-200 mb-3">
          Weekly Summary
        </h2>
        {weeklySummary.daysWithMeals === 0 ? (
          <p className="text-dark-400 text-sm">
            No meals planned this week yet. Tap the + buttons above to start
            planning.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-dark-100">
                {weeklySummary.avgCalories}
              </p>
              <p className="text-xs text-dark-400">Avg Daily kcal</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {weeklySummary.totalProtein}g
              </p>
              <p className="text-xs text-dark-400">Total Protein</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">
                {weeklySummary.totalCarbs}g
              </p>
              <p className="text-xs text-dark-400">Total Carbs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-400">
                {weeklySummary.totalFat}g
              </p>
              <p className="text-xs text-dark-400">Total Fat</p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Recipe picker modal */}
      {pickerOpen && (
        <RecipePicker
          onSelect={handlePickRecipe}
          onClose={() => {
            setPickerOpen(false);
            setPickerTarget(null);
          }}
        />
      )}
    </PageContainer>
  );
}
