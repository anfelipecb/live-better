'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Bookmark, BookmarkCheck, ExternalLink, Loader2, Newspaper } from 'lucide-react';
import { useSupabase, useUserId } from '@/lib/supabase/client';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

// ── NYT types ────────────────────────────────────────────────────────

interface NYTDoc {
  web_url: string;
  headline: { main: string };
  abstract: string;
  section_name: string;
  pub_date: string;
  multimedia: { url: string; subtype?: string }[];
}

const TOPICS = [
  { label: 'Wellness', query: 'wellness self-care mindfulness' },
  { label: 'Fitness', query: 'fitness exercise workout training' },
  { label: 'Nutrition', query: 'nutrition healthy eating diet' },
  { label: 'Mental Health', query: 'mental health stress anxiety meditation' },
  { label: 'Sleep', query: 'sleep rest recovery insomnia' },
];

export default function ArticlesPage() {
  const supabase = useSupabase();
  const userId = useUserId();

  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState(0);
  const [articles, setArticles] = useState<NYTDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  // ── Load saved articles on mount ──────────────────────────────
  useEffect(() => {
    if (!userId) return;
    supabase
      .from('saved_articles')
      .select('nyt_url')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data) setSavedUrls(new Set(data.map((r) => r.nyt_url)));
      });
  }, [supabase, userId]);

  // ── Search function ───────────────────────────────────────────
  const [apiError, setApiError] = useState<string | null>(null);

  const searchArticles = useCallback(
    async (q: string) => {
      setLoading(true);
      setApiError(null);
      try {
        const res = await fetch(
          `/api/articles/search?q=${encodeURIComponent(q)}`,
        );
        const data = await res.json();
        if (data.error) {
          setApiError(data.error);
          setArticles([]);
        } else {
          setArticles(data?.response?.docs || []);
        }
      } catch {
        setApiError('Failed to fetch articles. Check your connection.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ── Load default topic on mount ───────────────────────────────
  useEffect(() => {
    searchArticles(TOPICS[0].query);
  }, [searchArticles]);

  // ── Debounced search on query change ──────────────────────────
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => searchArticles(query), 600);
    return () => clearTimeout(timer);
  }, [query, searchArticles]);

  // ── Topic click ───────────────────────────────────────────────
  function handleTopicClick(idx: number) {
    setActiveTopic(idx);
    setQuery('');
    searchArticles(TOPICS[idx].query);
  }

  // ── Save / unsave ─────────────────────────────────────────────
  async function toggleSave(doc: NYTDoc) {
    if (!userId) return;
    const url = doc.web_url;

    if (savedUrls.has(url)) {
      await supabase
        .from('saved_articles')
        .delete()
        .eq('user_id', userId)
        .eq('nyt_url', url);
      setSavedUrls((prev) => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
    } else {
      const thumb = doc.multimedia?.find((m) => m.subtype === 'thumbnail');
      await supabase.from('saved_articles').insert({
        user_id: userId,
        nyt_url: url,
        title: doc.headline.main,
        abstract: doc.abstract,
        section: doc.section_name,
        published_date: doc.pub_date?.split('T')[0] || null,
        thumbnail_url: thumb ? `https://static01.nyt.com/${thumb.url}` : null,
      });
      setSavedUrls((prev) => new Set(prev).add(url));
    }
  }

  // ── Helpers ───────────────────────────────────────────────────
  function getThumbnail(doc: NYTDoc): string | null {
    const img = doc.multimedia?.find(
      (m) => m.subtype === 'xlarge' || m.subtype === 'thumbnail',
    );
    return img ? `https://static01.nyt.com/${img.url}` : null;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <PageContainer>
      <Header
        title="Wellbeing Articles"
        subtitle="Curated health & wellness reading from the NYT"
      />

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
        <Input
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Topics */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TOPICS.map((topic, idx) => (
          <button
            key={topic.label}
            onClick={() => handleTopicClick(idx)}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors cursor-pointer ${
              activeTopic === idx && !query.trim()
                ? 'bg-accent text-white'
                : 'glass text-dark-300 hover:text-dark-100'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {apiError && (
        <GlassCard className="mb-4 border-danger/20">
          <p className="text-danger text-sm">API Error: {apiError}</p>
          <p className="text-dark-400 text-xs mt-1">The NYT API key may be invalid or rate-limited. Articles will work once a valid key is configured.</p>
        </GlassCard>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : articles.length === 0 && !apiError ? (
        <GlassCard className="text-center py-16">
          <Newspaper size={32} className="mx-auto mb-3 text-dark-500" />
          <p className="text-dark-400">No articles found. Try a different search.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {articles.map((doc) => {
            const thumb = getThumbnail(doc);
            const saved = savedUrls.has(doc.web_url);

            return (
              <GlassCard key={doc.web_url} hover className="cursor-default">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {thumb && (
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-dark-800">
                      <img
                        src={thumb}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-dark-100 font-semibold text-sm sm:text-base line-clamp-2">
                        {doc.headline.main}
                      </h3>
                      <button
                        onClick={() => toggleSave(doc)}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title={saved ? 'Unsave' : 'Save'}
                      >
                        {saved ? (
                          <BookmarkCheck size={18} className="text-accent" />
                        ) : (
                          <Bookmark size={18} className="text-dark-400" />
                        )}
                      </button>
                    </div>

                    {doc.abstract && (
                      <p className="text-dark-400 text-xs sm:text-sm mt-1 line-clamp-2">
                        {doc.abstract}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      {doc.section_name && (
                        <Badge>{doc.section_name}</Badge>
                      )}
                      {doc.pub_date && (
                        <span className="text-xs text-dark-500">
                          {formatDate(doc.pub_date)}
                        </span>
                      )}
                      <a
                        href={doc.web_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline flex items-center gap-1 ml-auto"
                      >
                        Read <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
