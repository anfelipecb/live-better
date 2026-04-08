'use client';

import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import type { Recipe } from '@/types';
import { Clock, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <GlassCard hover className="h-full cursor-pointer">
        <div className="text-4xl mb-3">{recipe.imageEmoji}</div>
        <h3 className="text-dark-100 font-semibold text-lg mb-1">
          {recipe.name}
        </h3>
        <p className="text-dark-400 text-sm line-clamp-2 mb-3">
          {recipe.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-dark-300">
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
      </GlassCard>
    </Link>
  );
}
