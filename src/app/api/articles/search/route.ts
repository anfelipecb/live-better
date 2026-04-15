import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/articles/search?q=wellness&page=0
 * Proxies NYT Article Search API. Hides the API key server-side.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q') || 'health wellness fitness nutrition';
  const page = searchParams.get('page') || '0';

  const apiKey = process.env.NYT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'NYT API key not configured' },
      { status: 500 },
    );
  }

  const url = new URL('https://api.nytimes.com/svc/search/v2/articlesearch.json');
  url.searchParams.set('q', query);
  url.searchParams.set('page', page);
  url.searchParams.set('fq', 'section_name:("Health" "Well" "Science" "Food")');
  url.searchParams.set('sort', 'newest');
  url.searchParams.set('api-key', apiKey);

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 600 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('NYT Article Search error:', err);
    return NextResponse.json(
      { response: { docs: [] } },
      { status: 502 },
    );
  }
}
