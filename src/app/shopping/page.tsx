'use client';

import { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { generateId, getToday, getWeekDates } from '@/lib/utils';
import type { ShoppingItem } from '@/types';

const CATEGORIES = [
  'Produce',
  'Protein',
  'Dairy',
  'Grains',
  'Pantry',
  'Spices',
  'Other',
] as const;

type Category = (typeof CATEGORIES)[number];

export default function ShoppingPage() {
  const { state, dispatch } = useApp();
  const { shoppingList, mealAssignments, recipes } = state;

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>('Produce');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  // ── Derived data ───────────────────────────────────────────────────

  const totalItems = shoppingList.length;
  const checkedCount = shoppingList.filter((i) => i.checked).length;

  const groupedItems = useMemo(() => {
    const groups: Record<string, ShoppingItem[]> = {};
    for (const item of shoppingList) {
      const cat =
        CATEGORIES.find(
          (c) => c.toLowerCase() === item.category.toLowerCase(),
        ) ?? 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    }
    // Sort groups by CATEGORIES order
    const sorted: [string, ShoppingItem[]][] = [];
    for (const cat of CATEGORIES) {
      if (groups[cat]?.length) {
        sorted.push([cat, groups[cat]]);
      }
    }
    return sorted;
  }, [shoppingList]);

  // ── Handlers ───────────────────────────────────────────────────────

  function handleGenerateFromMeals() {
    const today = getToday();
    const weekDates = getWeekDates(today);

    // Filter meal assignments for this week
    const weekAssignments = mealAssignments.filter((ma) =>
      weekDates.includes(ma.date),
    );

    if (weekAssignments.length === 0) return;

    // Aggregate ingredients from all assigned recipes
    const ingredientMap = new Map<
      string,
      { amount: number; unit: string; category: string }
    >();

    for (const assignment of weekAssignments) {
      const recipe = recipes.find((r) => r.id === assignment.recipeId);
      if (!recipe) continue;

      const servingsMultiplier = assignment.servings / recipe.servings;

      for (const ing of recipe.ingredients) {
        const key = ing.name.toLowerCase();
        const existing = ingredientMap.get(key);

        if (existing) {
          // Only aggregate amounts when units match
          if (existing.unit === ing.unit) {
            existing.amount += ing.amount * servingsMultiplier;
          }
          // If units differ, keep the first one (simplistic aggregation)
        } else {
          ingredientMap.set(key, {
            amount: ing.amount * servingsMultiplier,
            unit: ing.unit,
            category: ing.category,
          });
        }
      }
    }

    // Build ShoppingItem[]
    const items: ShoppingItem[] = Array.from(ingredientMap.entries()).map(
      ([name, data]) => ({
        id: generateId(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount: Math.round(data.amount * 100) / 100,
        unit: data.unit,
        category: data.category,
        checked: false,
        fromMealPlan: true,
      }),
    );

    // Preserve manually-added items that are not from meal plan
    const manualItems = shoppingList.filter((item) => !item.fromMealPlan);
    dispatch({
      type: 'GENERATE_SHOPPING_LIST',
      payload: [...items, ...manualItems],
    });
  }

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newItemName.trim();
    if (!trimmed) return;

    dispatch({
      type: 'ADD_SHOPPING_ITEM',
      payload: {
        id: generateId(),
        name: trimmed,
        category: newItemCategory.toLowerCase(),
        checked: false,
        fromMealPlan: false,
      },
    });

    setNewItemName('');
  }

  function handleToggle(id: string) {
    dispatch({ type: 'TOGGLE_SHOPPING_ITEM', payload: id });
  }

  function handleClearChecked() {
    dispatch({ type: 'CLEAR_CHECKED_ITEMS' });
  }

  function toggleSection(category: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <PageContainer>
      <Header
        title="Shopping List"
        subtitle="Everything you need"
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerateFromMeals}
            >
              <RefreshCw size={16} className="mr-1.5" />
              Generate from Meals
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChecked}
              disabled={checkedCount === 0}
            >
              <Trash2 size={16} className="mr-1.5" />
              Clear Checked
            </Button>
          </div>
        }
      />

      {/* ── Summary bar ──────────────────────────────────────────────── */}
      {totalItems > 0 && (
        <div className="flex items-center gap-3 mb-5 text-sm text-dark-300">
          <ShoppingCart size={16} className="text-accent" />
          <span>
            <span className="text-dark-100 font-medium">{totalItems}</span>{' '}
            item{totalItems !== 1 && 's'} total
          </span>
          <span className="text-dark-600">|</span>
          <span>
            <span className="text-dark-100 font-medium">{checkedCount}</span>{' '}
            checked
          </span>
        </div>
      )}

      {/* ── Add Item form ────────────────────────────────────────────── */}
      <GlassCard className="mb-6">
        <form onSubmit={handleAddItem} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <Input
              label="Add Item"
              placeholder="e.g. Chicken breast"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark-200">
              Category
            </label>
            <select
              value={newItemCategory}
              onChange={(e) =>
                setNewItemCategory(e.target.value as Category)
              }
              className="bg-dark-800 border border-dark-600 focus:border-accent rounded-lg px-4 py-2 text-dark-100 outline-none transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" size="md">
            <Plus size={16} className="mr-1.5" />
            Add
          </Button>
        </form>
      </GlassCard>

      {/* ── Shopping list by category ────────────────────────────────── */}
      {totalItems === 0 ? (
        <GlassCard className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto mb-4 text-dark-500" />
          <p className="text-dark-300 text-lg mb-2">
            Your shopping list is empty
          </p>
          <p className="text-dark-500 text-sm mb-6">
            Generate items from your meal plan or add them manually above.
          </p>
          <Button variant="secondary" onClick={handleGenerateFromMeals}>
            <RefreshCw size={16} className="mr-1.5" />
            Generate from Meals
          </Button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {groupedItems.map(([category, items]) => {
            const isCollapsed = collapsedSections.has(category);
            const categoryChecked = items.filter((i) => i.checked).length;

            return (
              <GlassCard key={category} className="!p-0 overflow-hidden">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(category)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-dark-100 font-semibold">
                      {category}
                    </span>
                    <span className="text-xs text-dark-400 bg-dark-700 px-2 py-0.5 rounded-full">
                      {categoryChecked === items.length
                        ? `${items.length} done`
                        : `${items.length} item${items.length !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown size={18} className="text-dark-400" />
                  ) : (
                    <ChevronUp size={18} className="text-dark-400" />
                  )}
                </button>

                {/* Items list */}
                {!isCollapsed && (
                  <div className="border-t border-dark-700">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-6 py-3 border-b border-dark-700/50 last:border-b-0 transition-opacity ${
                          item.checked ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggle(item.id)}
                          className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                            item.checked
                              ? 'bg-accent border-accent'
                              : 'border-dark-500 hover:border-accent'
                          }`}
                        >
                          {item.checked && (
                            <Check size={14} className="text-white" />
                          )}
                        </button>

                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-dark-100 ${
                              item.checked ? 'line-through' : ''
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.amount != null && item.unit && (
                            <span className="ml-2 text-sm text-dark-400">
                              {item.amount} {item.unit}
                            </span>
                          )}
                        </div>

                        {/* Meal plan tag */}
                        {item.fromMealPlan && (
                          <span className="shrink-0 text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                            Meal Plan
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
