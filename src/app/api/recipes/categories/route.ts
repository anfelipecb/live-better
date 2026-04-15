import { NextResponse } from 'next/server';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

/**
 * GET /api/recipes/categories
 * Returns all TheMealDB meal categories.
 */
export async function GET() {
  try {
    const res = await fetch(`${BASE}/categories.php`, {
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('TheMealDB categories error:', err);
    return NextResponse.json({ categories: [] }, { status: 502 });
  }
}
