'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { useUserId } from '@/lib/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import type { MealSlot } from '@/types';
import { Search, Clock, Flame, Heart, Loader2 } from 'lucide-react';

// ── Saved recipe from Supabase ──────────────────────────────────────

interface SavedRecipe {
  id: string;
  meal_db_id: string;
  name: string;
  thumbnail: string | null;
  category: string | null;
  area: string | null;
  created_at: string;
}

// ── Category filter for seed recipes ────────────────────────────────

const seedCategories: { label: string; value: MealSlot | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
];

export default function RecipesPage() {
  const { state } = useApp();
  const userId = useUserId();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MealSlot | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'saved' | 'library'>('saved');

  // ── Saved recipes from Supabase ───────────────────────────────────
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoadingSaved(false);
      return;
    }

    async function load() {
      try {
        const res = await fetch('/api/saved-recipes');
        const json = await res.json();
        setSavedRecipes(json.data || []);
      } catch (err) {
        console.error('Failed to load saved recipes:', err);
      } finally {
        setLoadingSaved(false);
      }
    }
    load();
  }, [userId]);

  // ── Filter seed recipes ───────────────────────────────────────────
  const filteredSeed = state.recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // ── Filter saved recipes ──────────────────────────────────────────
  const filteredSaved = savedRecipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <Header title="Recipes" subtitle="Your saved meals & recipe library" />

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-accent text-white'
              : 'glass text-dark-300 hover:text-dark-100'
          }`}
        >
          <Heart size={14} className="inline mr-1.5 -mt-0.5" />
          My Saved ({savedRecipes.length})
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'library'
              ? 'bg-accent text-white'
              : 'glass text-dark-300 hover:text-dark-100'
          }`}
        >
          Built-in Library ({state.recipes.length})
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <Input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filter (only for library tab) */}
      {activeTab === 'library' && (
        <div className="flex gap-2 flex-wrap mb-6">
          {seedCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-accent text-white'
                  : 'glass text-dark-300 hover:text-dark-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Saved Recipes Tab ─────────────────────────────────────── */}
      {activeTab === 'saved' && (
        <>
          {loadingSaved ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          ) : filteredSaved.length === 0 ? (
            <GlassCard className="text-center py-16">
              <Heart size={32} className="mx-auto mb-3 text-dark-500" />
              <h2 className="text-lg font-semibold text-dark-200 mb-2">
                No saved recipes yet
              </h2>
              <p className="text-dark-400 mb-4">
                Discover and save recipes from TheMealDB.
              </p>
              <Link
                href="/discover"
                className="text-accent hover:underline font-medium"
              >
                Browse recipes →
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSaved.map((recipe) => (
                <Link key={recipe.id} href={`/discover/${recipe.meal_db_id}`}>
                  <GlassCard hover className="h-full cursor-pointer">
                    {recipe.thumbnail && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                        <Image
                          src={recipe.thumbnail}
                          alt={recipe.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <h3 className="text-dark-100 font-bold text-lg mb-1">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {recipe.category && <Badge>{recipe.category}</Badge>}
                      {recipe.area && <Badge variant="default">{recipe.area}</Badge>}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Library Tab (seed recipes) ────────────────────────────── */}
      {activeTab === 'library' && (
        <>
          {filteredSeed.length === 0 ? (
            <GlassCard>
              <p className="text-center text-dark-400 py-8">
                No recipes found. Try adjusting your search or filters.
              </p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSeed.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                  <GlassCard hover className="h-full cursor-pointer">
                    <div className="text-4xl mb-3">{recipe.imageEmoji}</div>
                    <h3 className="text-dark-100 font-bold text-lg mb-1">
                      {recipe.name}
                    </h3>
                    <p className="text-dark-400 text-sm line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-300 mb-3">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        {recipe.calories} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {recipe.prepTime + recipe.cookTime}m
                      </span>
                      <span className="text-blue-400 font-medium">
                        {recipe.macros.protein}g protein
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
