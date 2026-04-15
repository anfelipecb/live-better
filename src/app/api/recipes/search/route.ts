import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

/**
 * GET /api/recipes/search?s=chicken&c=Beef&a=Italian
 * Proxies TheMealDB search/filter endpoints.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const name = searchParams.get('s');
  const category = searchParams.get('c');
  const area = searchParams.get('a');

  let url: string;
  if (name !== null) {
    url = `${BASE}/search.php?s=${encodeURIComponent(name)}`;
  } else if (category) {
    url = `${BASE}/filter.php?c=${encodeURIComponent(category)}`;
  } else if (area) {
    url = `${BASE}/filter.php?a=${encodeURIComponent(area)}`;
  } else {
    url = `${BASE}/search.php?s=`;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('TheMealDB search error:', err);
    return NextResponse.json({ meals: null }, { status: 502 });
  }
}
