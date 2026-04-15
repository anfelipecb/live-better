/**
 * Types for TheMealDB API responses.
 * Docs: https://www.themealdb.com/api.php
 */

export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // TheMealDB uses strIngredient1..20 and strMeasure1..20
  [key: string]: string | null;
}

/** Compact meal returned by filter endpoints (no instructions/ingredients). */
export interface MealDBMealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDBCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealDBSearchResponse {
  meals: MealDBMeal[] | null;
}

export interface MealDBFilterResponse {
  meals: MealDBMealSummary[] | null;
}

export interface MealDBCategoriesResponse {
  categories: MealDBCategory[];
}

/** Parsed ingredient (extracted from strIngredient1..20 + strMeasure1..20). */
export interface ParsedIngredient {
  name: string;
  measure: string;
}

/** Parse the 20 ingredient/measure fields from a TheMealDB meal. */
export function parseIngredients(meal: MealDBMeal): ParsedIngredient[] {
  const ingredients: ParsedIngredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure?.trim() || '',
      });
    }
  }
  return ingredients;
}
