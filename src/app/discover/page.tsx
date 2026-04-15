'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useUserId } from '@/lib/supabase/client';
import { parseIngredients } from '@/types/mealdb';
import type {
  MealDBMeal,
  MealDBMealSummary,
  MealDBCategory,
  MealDBSearchResponse,
  MealDBFilterResponse,
  MealDBCategoriesResponse,
} from '@/types/mealdb';
import { Search, Heart, MapPin, ChefHat, Loader2 } from 'lucide-react';

interface FullResult {
  kind: 'full';
  meal: MealDBMeal;
}

interface SummaryResult {
  kind: 'summary';
  meal: MealDBMealSummary;
}

type ResultItem = FullResult | SummaryResult;

export default function DiscoverPage() {
  const userId = useUserId();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [categories, setCategories] = useState<MealDBCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  // ── Fetch categories on mount ────────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/recipes/categories');
        const data: MealDBCategoriesResponse = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    loadCategories();
  }, []);

  // ── Fetch saved recipe IDs on mount ──────────────────────────────
  useEffect(() => {
    if (!userId) return;

    async function loadSaved() {
      try {
        const res = await fetch('/api/saved-recipes');
        const json = await res.json();
        if (json.data) {
          setSavedIds(new Set(json.data.map((r: { meal_db_id: string }) => r.meal_db_id)));
        }
      } catch (err) {
        console.error('Failed to load saved IDs:', err);
      }
    }
    loadSaved();
  }, [userId]);

  // ── Debounced search by name ─────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      if (activeCategory) {
        fetchByCategory(activeCategory);
      } else {
        setResults([]);
      }
      return;
    }

    setActiveCategory(null);
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/recipes/search?s=${encodeURIComponent(query.trim())}`,
        );
        const data: MealDBSearchResponse = await res.json();
        setResults(
          (data.meals || []).map((m): FullResult => ({ kind: 'full', meal: m })),
        );
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ── Fetch by category ────────────────────────────────────────────
  const fetchByCategory = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/recipes/search?c=${encodeURIComponent(category)}`,
      );
      const data: MealDBFilterResponse = await res.json();
      setResults(
        (data.meals || []).map((m): SummaryResult => ({ kind: 'summary', meal: m })),
      );
    } catch (err) {
      console.error('Category fetch failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleCategoryClick(category: string) {
    setQuery('');
    if (activeCategory === category) {
      setActiveCategory(null);
      setResults([]);
    } else {
      setActiveCategory(category);
      fetchByCategory(category);
    }
  }

  // ── Save / Unsave ────────────────────────────────────────────────
  async function handleToggleSave(item: ResultItem, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return;

    const mealId = item.meal.idMeal;
    const isSaved = savedIds.has(mealId);

    setSavingIds((prev) => new Set(prev).add(mealId));

    try {
      if (isSaved) {
        await fetch(`/api/saved-recipes?meal_db_id=${mealId}`, {
          method: 'DELETE',
        });

        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(mealId);
          return next;
        });
      } else {
        let fullMeal: MealDBMeal;
        if (item.kind === 'full') {
          fullMeal = item.meal;
        } else {
          const res = await fetch(`/api/recipes/${mealId}`);
          const data: MealDBSearchResponse = await res.json();
          if (!data.meals?.[0]) return;
          fullMeal = data.meals[0];
        }

        const ingredients = parseIngredients(fullMeal);

        await fetch('/api/saved-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meal_db_id: fullMeal.idMeal,
            name: fullMeal.strMeal,
            thumbnail: fullMeal.strMealThumb,
            category: fullMeal.strCategory,
            area: fullMeal.strArea,
            instructions: fullMeal.strInstructions,
            ingredients,
          }),
        });

        setSavedIds((prev) => new Set(prev).add(mealId));
      }
    } catch (err) {
      console.error('Save/unsave failed:', err);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(mealId);
        return next;
      });
    }
  }

  return (
    <PageContainer>
      <Header
        title="Discover Recipes"
        subtitle="Search thousands of recipes from around the world"
      />

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <Input
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.idCategory}
            onClick={() => handleCategoryClick(cat.strCategory)}
            className={`flex-shrink-0 px-4 py-1.5 text-sm rounded-full font-medium transition-colors cursor-pointer ${
              activeCategory === cat.strCategory
                ? 'bg-accent text-white'
                : 'glass text-dark-300 hover:text-dark-100'
            }`}
          >
            {cat.strCategory}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => (
            <Link key={item.meal.idMeal} href={`/discover/${item.meal.idMeal}`}>
              <GlassCard hover className="h-full cursor-pointer !p-0 overflow-hidden">
                <div className="relative">
                  <Image
                    src={item.meal.strMealThumb}
                    alt={item.meal.strMeal}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={(e) => handleToggleSave(item, e)}
                    disabled={savingIds.has(item.meal.idMeal)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors cursor-pointer"
                  >
                    {savingIds.has(item.meal.idMeal) ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${
                          savedIds.has(item.meal.idMeal)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-dark-100 font-bold text-lg mb-2 line-clamp-1">
                    {item.meal.strMeal}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {item.kind === 'full' && item.meal.strCategory && (
                      <Badge>
                        <ChefHat className="w-3 h-3 mr-1" />
                        {item.meal.strCategory}
                      </Badge>
                    )}
                    {item.kind === 'full' && item.meal.strArea && (
                      <Badge>
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.meal.strArea}
                      </Badge>
                    )}
                    {item.kind === 'summary' && activeCategory && (
                      <Badge>
                        <ChefHat className="w-3 h-3 mr-1" />
                        {activeCategory}
                      </Badge>
                    )}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && (query.trim() || activeCategory) && (
        <GlassCard>
          <p className="text-center text-dark-400 py-8">
            No recipes found. Try a different search or category.
          </p>
        </GlassCard>
      )}

      {/* Initial state -- no search, no category */}
      {!loading && results.length === 0 && !query.trim() && !activeCategory && (
        <GlassCard>
          <div className="text-center py-12">
            <ChefHat className="w-12 h-12 text-dark-500 mx-auto mb-4" />
            <p className="text-dark-300 text-lg mb-1">
              Start exploring
            </p>
            <p className="text-dark-500 text-sm">
              Search for a recipe by name or pick a category above
            </p>
          </div>
        </GlassCard>
      )}
    </PageContainer>
  );
}
