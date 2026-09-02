// Custom React hooks for MangaDex API with mock fallback
import { useState, useEffect, useCallback } from 'react';
import {
  fetchTrending, fetchLatest, fetchByCategory,
  searchManga, fetchMangaDetail, fetchChapters,
  fetchChapterPages, fetchStats,
} from './mangadex';
import { getScraperUpdates, getMangaById, LIBRARY_DATA } from '../data/mockData';

// â”€â”€ Generic fetch hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useFetch(fetchFn, fallbackFn, deps = []) {
  const [data,      setData]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (!result || result.length === 0) {
        // API returned empty â€” use mock fallback
        const mock = fallbackFn ? fallbackFn() : [];
        setData(mock);
        setUsingMock(true);
      } else {
        setData(result);
        setUsingMock(false);
      }
      setLastFetch(new Date());
    } catch (err) {
      // API failed â€” use mock fallback silently
      const mock = fallbackFn ? fallbackFn() : [];
      setData(mock);
      setUsingMock(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => { load(); }, [load]); // eslint-disable-line

  return { data, loading, error, reload: load, lastFetch, usingMock };
}

// â”€â”€ Trending â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useTrending(limit = 20) {
  const hook = useFetch(
    () => fetchTrending(limit),
    () => getScraperUpdates().filter(m => m.isTrending),
    [limit]
  );
  // Auto-refresh every 10 min
  useEffect(() => {
    const t = setInterval(() => hook.reload(), 10 * 60 * 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line
  return hook;
}

// â”€â”€ Latest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useLatest(limit = 20) {
  const hook = useFetch(
    () => fetchLatest(limit),
    () => getScraperUpdates().filter(m => m.isNew),
    [limit]
  );
  // Auto-refresh every 5 min
  useEffect(() => {
    const t = setInterval(() => hook.reload(), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []); // eslint-disable-line
  return hook;
}

// â”€â”€ Category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useCategory(categoryId) {
  return useFetch(
    () => categoryId ? fetchByCategory(categoryId) : Promise.resolve([]),
    () => categoryId
      ? getScraperUpdates().filter(m => m.genres?.includes(categoryId))
      : [],
    [categoryId]
  );
}

// â”€â”€ Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        if (data.length > 0) {
          setResults(data);
        } else {
          // Fallback to mock search
          const q = query.toLowerCase();
          const mock = getScraperUpdates().filter(m =>
            m.title.toLowerCase().includes(q) ||
            m.author.toLowerCase().includes(q)
          );
          setResults(mock);
        }
      } catch (err) {
        // Fallback to mock search
        const q = query.toLowerCase();
        const mock = getScraperUpdates().filter(m =>
          m.title.toLowerCase().includes(q) ||
          m.author.toLowerCase().includes(q)
        );
        setResults(mock);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error };
}

// â”€â”€ Manga Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useMangaDetail(mangaId) {
  const [manga,   setManga]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!mangaId) return;
    setLoading(true);
    Promise.all([fetchMangaDetail(mangaId), fetchStats(mangaId)])
      .then(([detail, stats]) => {
        if (detail) {
          setManga({
            ...detail,
            rating: stats.rating,
            views: stats.follows > 1000000
              ? (stats.follows / 1000000).toFixed(1) + 'M'
              : stats.follows > 1000
                ? (stats.follows / 1000).toFixed(0) + 'K'
                : String(stats.follows),
          });
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [mangaId]);

  return { manga, loading, error };
}

// â”€â”€ Chapters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useChapters(mangaId, limit = 30) {
  return useFetch(
    () => mangaId ? fetchChapters(mangaId, limit) : Promise.resolve([]),
    () => [], // no mock chapters
    [mangaId, limit]
  );
}

// â”€â”€ Chapter Pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useChapterPages(chapterId) {
  const [pages,   setPages]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!chapterId) { setLoading(false); return; }
    setLoading(true);
    setPages([]);
    fetchChapterPages(chapterId)
      .then(({ pages: p, total: t }) => {
        setPages(p || []);
        setTotal(t || 0);
      })
      .catch(err => {
        setError(err.message);
        setPages([]);
      })
      .finally(() => setLoading(false));
  }, [chapterId]);

  return { pages, total, loading, error };
}

// â”€â”€ Library (always mock for now) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useLibrary() {
  return LIBRARY_DATA.map(e => ({
    ...e,
    manga: getMangaById(e.mangaId),
  })).filter(e => e.manga);
}
