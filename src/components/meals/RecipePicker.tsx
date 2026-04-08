'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { MealSlot } from '@/types';
import { Search, X, Flame, Clock } from 'lucide-react';

interface RecipePickerProps {
  onSelect: (recipeId: string) => void;
  onClose: () => void;
}

const categories: { label: string; value: MealSlot | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Breakfast', value: 'breakfast' },
  { label: 'Lunch', value: 'lunch' },
  { label: 'Dinner', value: 'dinner' },
  { label: 'Snack', value: 'snack' },
];

export default function RecipePicker({ onSelect, onClose }: RecipePickerProps) {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MealSlot | 'all'>('all');

  const filtered = state.recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <h3 className="text-lg font-semibold text-dark-100">Pick a Recipe</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-dark-300" />
          </button>
        </div>

        {/* Search & filters */}
        <div className="p-4 space-y-3 border-b border-dark-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <Input
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                  category === c.value
                    ? 'bg-accent text-white'
                    : 'glass text-dark-300 hover:text-dark-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-dark-400 py-8">No recipes found</p>
          )}
          {filtered.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer"
            >
              <span className="text-2xl">{recipe.imageEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-dark-100 font-medium text-sm truncate">
                  {recipe.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-dark-400 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {recipe.calories} kcal
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-blue-400" />
                    {recipe.prepTime + recipe.cookTime}m
                  </span>
                  <span className="text-blue-400">
                    {recipe.macros.protein}g protein
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
