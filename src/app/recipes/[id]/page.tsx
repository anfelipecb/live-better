'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MacroBar from '@/components/meals/MacroBar';
import { generateId, getToday, getWeekDates } from '@/lib/utils';
import type { MealSlot } from '@/types';
import {
  ChevronLeft,
  Clock,
  Flame,
  UtensilsCrossed,
  Plus,
  X,
} from 'lucide-react';

const mealSlots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, dispatch } = useApp();
  const recipe = state.recipes.find((r) => r.id === id);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignDate, setAssignDate] = useState(getToday());
  const [assignSlot, setAssignSlot] = useState<MealSlot>('lunch');

  if (!recipe) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <h2 className="text-xl font-bold text-dark-100 mb-2">
            Recipe not found
          </h2>
          <p className="text-dark-400 mb-6">
            This recipe doesn&apos;t seem to exist.
          </p>
          <Link href="/recipes">
            <Button variant="secondary">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  function handleAssign() {
    if (!recipe) return;
    dispatch({
      type: 'ASSIGN_MEAL',
      payload: {
        id: generateId(),
        date: assignDate,
        slot: assignSlot,
        recipeId: recipe.id,
        servings: recipe.servings,
      },
    });
    setShowAssignModal(false);
  }

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-dark-100 transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        All Recipes
      </Link>

      {/* Hero section */}
      <div className="mb-6">
        <div className="text-6xl mb-4">{recipe.imageEmoji}</div>
        <h1 className="text-3xl font-bold text-dark-100 mb-2">
          {recipe.name}
        </h1>
        <p className="text-dark-300 text-lg">{recipe.description}</p>
      </div>

      {/* Macro breakdown */}
      <GlassCard className="mb-4">
        <MacroBar macros={recipe.macros} calories={recipe.calories} />
      </GlassCard>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <GlassCard className="text-center !p-4">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-dark-100">{recipe.calories}</p>
          <p className="text-xs text-dark-400">Calories</p>
        </GlassCard>
        <GlassCard className="text-center !p-4">
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-dark-100">{recipe.prepTime}m</p>
          <p className="text-xs text-dark-400">Prep Time</p>
        </GlassCard>
        <GlassCard className="text-center !p-4">
          <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-dark-100">{recipe.cookTime}m</p>
          <p className="text-xs text-dark-400">Cook Time</p>
        </GlassCard>
        <GlassCard className="text-center !p-4">
          <UtensilsCrossed className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-dark-100">{recipe.servings}</p>
          <p className="text-xs text-dark-400">Servings</p>
        </GlassCard>
      </div>

      {/* Ingredients */}
      <GlassCard className="mb-4">
        <h2 className="text-lg font-semibold text-dark-100 mb-4">
          Ingredients
        </h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm py-1.5 border-b border-dark-700 last:border-0"
            >
              <span className="text-dark-200">{ing.name}</span>
              <span className="text-dark-400 font-mono text-xs">
                {ing.amount} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* Steps */}
      <GlassCard className="mb-6">
        <h2 className="text-lg font-semibold text-dark-100 mb-4">Steps</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-dark-200 text-sm leading-relaxed pt-0.5">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </GlassCard>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {/* Add to Meal Plan button */}
      <Button
        onClick={() => setShowAssignModal(true)}
        size="lg"
        className="w-full sm:w-auto"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add to Meal Plan
      </Button>

      {/* Assign modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          />
          <div className="relative glass rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-100">
                Add to Meal Plan
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-dark-300" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Date"
                type="date"
                value={assignDate}
                onChange={(e) => setAssignDate(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark-200">
                  Meal Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mealSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setAssignSlot(slot)}
                      className={`px-3 py-2 text-sm rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                        assignSlot === slot
                          ? 'bg-accent text-white'
                          : 'glass text-dark-300 hover:text-dark-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleAssign} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Assign to {assignSlot}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
