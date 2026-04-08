'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import type { MealSlot } from '@/types';
import { Search, Clock, Flame } from 'lucide-react';

const categories: { label: string; value: MealSlot | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
];

export default function RecipesPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MealSlot | 'all'>('all');

  const filtered = state.recipes.filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageContainer>
      <Header title="Recipes" subtitle="Discover healthy meals" />

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

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
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

      {/* Recipe grid */}
      {filtered.length === 0 ? (
        <GlassCard>
          <p className="text-center text-dark-400 py-8">
            No recipes found. Try adjusting your search or filters.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
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
    </PageContainer>
  );
}
