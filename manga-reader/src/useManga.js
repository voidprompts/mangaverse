// ── Custom React hooks for MangaDex API ─────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import {
  fetchTrending, fetchLatest, fetchByCategory,
  searchManga, fetchMangaDetail, fetchChapters,
  fetchChapterPages, fetchStats,
} from './mangadex';

// Generic fetch hook
function useFetch(fetchFn, deps = [], immediate = true) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const load = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    if (immediate) load();
  }, [load]); // eslint-disable-line

  return { data, loading, error, reload: load, lastFetch };
}

// Hook: trending manga (auto-refreshes every 10 min)
export function useTrending(limit = 20) {
  const hook = useFetch(() => fetchTrending(limit), [limit]);

  useEffect(() => {
    const t = setInterval(() => hook.reload(), 10 * 60 * 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line

  return hook;
}

// Hook: latest/new releases (auto-refreshes every 5 min)
export function useLatest(limit = 20) {
  const hook = useFetch(() => fetchLatest(limit), [limit]);

  useEffect(() => {
    const t = setInterval(() => hook.reload(), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line

  return hook;
}

// Hook: manga by category
export function useCategory(categoryId) {
  return useFetch(
    () => categoryId ? fetchByCategory(categoryId) : Promise.resolve([]),
    [categoryId],
    !!categoryId
  );
}

// Hook: search
export function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!query?.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchManga(query);
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500); // debounce 500ms
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error };
}

// Hook: manga detail
export function useMangaDetail(mangaId) {
  const [manga,   setManga]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!mangaId) return;
    setLoading(true);
    Promise.all([
      fetchMangaDetail(mangaId),
      fetchStats(mangaId),
    ]).then(([detail, stats]) => {
      setManga({ ...detail, rating: stats.rating, views: stats.follows > 1000000
        ? (stats.follows / 1000000).toFixed(1) + 'M'
        : stats.follows > 1000
          ? (stats.follows / 1000).toFixed(0) + 'K'
          : String(stats.follows) });
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [mangaId]);

  return { manga, loading, error };
}

// Hook: chapter list
export function useChapters(mangaId, limit = 30) {
  return useFetch(
    () => mangaId ? fetchChapters(mangaId, limit) : Promise.resolve([]),
    [mangaId, limit],
    !!mangaId
  );
}

// Hook: chapter pages (actual manga images!)
export function useChapterPages(chapterId) {
  const [pages,   setPages]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!chapterId) return;
    setLoading(true);
    fetchChapterPages(chapterId)
      .then(({ pages: p, total: t }) => { setPages(p); setTotal(t); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [chapterId]);

  return { pages, total, loading, error };
}
