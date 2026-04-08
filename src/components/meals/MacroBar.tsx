'use client';

import type { Macros } from '@/types';

interface MacroBarProps {
  macros: Macros;
  calories: number;
}

export default function MacroBar({ macros, calories }: MacroBarProps) {
  const totalGrams = macros.protein + macros.carbs + macros.fat;
  if (totalGrams === 0) return null;

  const proteinPct = (macros.protein / totalGrams) * 100;
  const carbsPct = (macros.carbs / totalGrams) * 100;
  const fatPct = (macros.fat / totalGrams) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-dark-300">
        <span>Macro Breakdown</span>
        <span className="text-dark-100 font-medium">{calories} kcal</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 w-full rounded-full overflow-hidden">
        <div
          className="bg-blue-500 transition-all duration-500"
          style={{ width: `${proteinPct}%` }}
        />
        <div
          className="bg-amber-500 transition-all duration-500"
          style={{ width: `${carbsPct}%` }}
        />
        <div
          className="bg-pink-500 transition-all duration-500"
          style={{ width: `${fatPct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-dark-300">Protein</span>
          <span className="text-dark-100 font-medium">{macros.protein}g</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-dark-300">Carbs</span>
          <span className="text-dark-100 font-medium">{macros.carbs}g</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span className="text-dark-300">Fat</span>
          <span className="text-dark-100 font-medium">{macros.fat}g</span>
        </div>
      </div>
    </div>
  );
}
