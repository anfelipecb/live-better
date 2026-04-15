import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/** Admin client that bypasses RLS using anon key + no JWT.
 *  We manually check userId via Clerk server auth instead. */
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

/**
 * GET /api/saved-recipes — list saved recipes for the current user
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('saved_recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('GET saved_recipes error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  return NextResponse.json({ data });
}

/**
 * POST /api/saved-recipes — save a recipe for the current user
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabase();

  const { error } = await supabase.from('saved_recipes').insert({
    user_id: userId,
    meal_db_id: body.meal_db_id,
    name: body.name,
    thumbnail: body.thumbnail,
    category: body.category,
    area: body.area,
    instructions: body.instructions,
    ingredients: body.ingredients,
  });

  if (error) {
    console.error('POST saved_recipes error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/saved-recipes?meal_db_id=12345 — unsave a recipe
 */
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mealDbId = request.nextUrl.searchParams.get('meal_db_id');
  if (!mealDbId) {
    return NextResponse.json({ error: 'meal_db_id required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('user_id', userId)
    .eq('meal_db_id', mealDbId);

  if (error) {
    console.error('DELETE saved_recipes error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
