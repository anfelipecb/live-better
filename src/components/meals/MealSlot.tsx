'use client';

import Link from 'next/link';
import type { MealSlot as MealSlotType, MealAssignment, Recipe } from '@/types';
import { Plus, X, Flame } from 'lucide-react';

interface MealSlotProps {
  date: string;
  slot: MealSlotType;
  assignment?: MealAssignment;
  recipe?: Recipe;
  onAssign: () => void;
  onRemove: () => void;
}

export default function MealSlotCell({
  assignment,
  recipe,
  onAssign,
  onRemove,
}: MealSlotProps) {
  if (!assignment || !recipe) {
    return (
      <button
        onClick={onAssign}
        className="w-full h-full min-h-[60px] flex items-center justify-center rounded-lg border border-dashed border-dark-600 hover:border-accent/50 hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <Plus className="w-4 h-4 text-dark-500 group-hover:text-accent transition-colors" />
      </button>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[60px] glass rounded-lg p-2 group">
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-danger/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
      >
        <X className="w-3 h-3" />
      </button>
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="text-lg leading-none mb-1">{recipe.imageEmoji}</div>
        <p className="text-xs text-dark-100 font-medium truncate leading-tight">
          {recipe.name}
        </p>
        <p className="text-xs text-dark-400 flex items-center gap-0.5 mt-0.5">
          <Flame className="w-3 h-3 text-orange-400" />
          {recipe.calories}
        </p>
      </Link>
    </div>
  );
}
