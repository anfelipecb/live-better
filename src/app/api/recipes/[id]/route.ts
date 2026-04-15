import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

/**
 * GET /api/recipes/52772
 * Proxies TheMealDB lookup by meal ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const res = await fetch(`${BASE}/lookup.php?i=${id}`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('TheMealDB lookup error:', err);
    return NextResponse.json({ meals: null }, { status: 502 });
  }
}
