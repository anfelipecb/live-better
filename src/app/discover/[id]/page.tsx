'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageContainer from '@/components/layout/PageContainer';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useUserId } from '@/lib/supabase/client';
import { useApp } from '@/context/AppContext';
import { parseIngredients } from '@/types/mealdb';
import { generateId, getToday } from '@/lib/utils';
import type { MealDBMeal, MealDBSearchResponse } from '@/types/mealdb';
import type { MealSlot } from '@/types';
import {
  ChevronLeft,
  Heart,
  MapPin,
  ChefHat,
  Loader2,
  ExternalLink,
  Play,
  Plus,
  X,
} from 'lucide-react';

const mealSlots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function DiscoverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const userId = useUserId();
  const { dispatch } = useApp();

  const [meal, setMeal] = useState<MealDBMeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignDate, setAssignDate] = useState(getToday());
  const [assignSlot, setAssignSlot] = useState<MealSlot>('lunch');

  // ── Fetch meal detail ──────────────────────────────────────────
  useEffect(() => {
    async function loadMeal() {
      setLoading(true);
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data: MealDBSearchResponse = await res.json();
        setMeal(data.meals?.[0] ?? null);
      } catch (err) {
        console.error('Failed to fetch meal:', err);
        setMeal(null);
      } finally {
        setLoading(false);
      }
    }
    loadMeal();
  }, [id]);

  // ── Check if already saved (via API route) ─────────────────────
  useEffect(() => {
    if (!userId || !id) return;

    async function checkSaved() {
      try {
        const res = await fetch('/api/saved-recipes');
        const json = await res.json();
        const saved = (json.data || []).some(
          (r: { meal_db_id: string }) => r.meal_db_id === id,
        );
        setIsSaved(saved);
      } catch {
        setIsSaved(false);
      }
    }
    checkSaved();
  }, [userId, id]);

  // ── Toggle save (via API route) ────────────────────────────────
  async function handleToggleSave() {
    if (!userId || !meal) return;

    setSaving(true);
    try {
      if (isSaved) {
        await fetch(`/api/saved-recipes?meal_db_id=${meal.idMeal}`, {
          method: 'DELETE',
        });
        setIsSaved(false);
      } else {
        const ingredients = parseIngredients(meal);
        await fetch('/api/saved-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meal_db_id: meal.idMeal,
            name: meal.strMeal,
            thumbnail: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            ingredients,
          }),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Save/unsave failed:', err);
    } finally {
      setSaving(false);
    }
  }

  // ── Assign to meal plan ────────────────────────────────────────
  function handleAssign() {
    if (!meal) return;
    dispatch({
      type: 'ASSIGN_MEAL',
      payload: {
        id: generateId(),
        date: assignDate,
        slot: assignSlot,
        recipeId: meal.idMeal,
        servings: 1,
      },
    });
    setShowAssignModal(false);
  }

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </PageContainer>
    );
  }

  // ── Not found ──────────────────────────────────────────────────
  if (!meal) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍽️</p>
          <h2 className="text-xl font-bold text-dark-100 mb-2">
            Recipe not found
          </h2>
          <p className="text-dark-400 mb-6">
            This recipe doesn&apos;t seem to exist on TheMealDB.
          </p>
          <Link href="/discover">
            <Button variant="secondary">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Discover
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const ingredients = parseIngredients(meal);
  const tags = meal.strTags
    ? meal.strTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];
  const instructionSteps = meal.strInstructions
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-dark-100 transition-colors mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Discover
      </Link>

      {/* Hero image */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          width={800}
          height={500}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Title + badges */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-100 mb-3">
          {meal.strMeal}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {meal.strCategory && (
            <Badge>
              <ChefHat className="w-3 h-3 mr-1" />
              {meal.strCategory}
            </Badge>
          )}
          {meal.strArea && (
            <Badge>
              <MapPin className="w-3 h-3 mr-1" />
              {meal.strArea}
            </Badge>
          )}
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>

        {/* Save button */}
        <Button
          onClick={handleToggleSave}
          disabled={saving || !userId}
          variant={isSaved ? 'secondary' : 'primary'}
          className="mr-3"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
            />
          )}
          {isSaved ? 'Saved' : 'Save to My Recipes'}
        </Button>

        {isSaved && (
          <Button
            onClick={() => setShowAssignModal(true)}
            variant="secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Meal Plan
          </Button>
        )}
      </div>

      {/* Ingredients */}
      <GlassCard className="mb-4">
        <h2 className="text-lg font-semibold text-dark-100 mb-4">
          Ingredients
        </h2>
        <ul className="space-y-2">
          {ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex items-center justify-between text-sm py-1.5 border-b border-dark-700 last:border-0"
            >
              <span className="text-dark-200">{ing.name}</span>
              <span className="text-dark-400 font-mono text-xs">
                {ing.measure}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>

      {/* Instructions */}
      <GlassCard className="mb-6">
        <h2 className="text-lg font-semibold text-dark-100 mb-4">
          Instructions
        </h2>
        <ol className="space-y-4">
          {instructionSteps.map((step, i) => (
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

      {/* External links */}
      {(meal.strYoutube || meal.strSource) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {meal.strYoutube && (
            <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                <Play className="w-4 h-4 mr-2 text-red-500" />
                Watch on YouTube
              </Button>
            </a>
          )}
          {meal.strSource && (
            <a href={meal.strSource} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Original Source
              </Button>
            </a>
          )}
        </div>
      )}

      {/* Assign to Meal Plan modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          />
          <div className="relative glass-strong rounded-2xl w-full max-w-sm p-6">
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
