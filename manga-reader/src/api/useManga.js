import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchTrending, fetchLatest, fetchByCategory,
  searchManga, fetchMangaDetail, fetchChapters, fetchChapterPages,
} from './mangadex';
import {
  comickTrending, comickLatest, comickByCategory,
  comickSearch, comickDetail, comickChapters, comickChapterPages,
} from './comick';

// Merge two arrays, dedup by normalised title, cap at limit
function mergeManga(a, b, limit) {
  limit = limit || 40;
  const seen = new Set();
  const result = [];
  const all = [...(a || []), ...(b || [])];
  for (const item of all) {
    if (!item) continue;
    const key = (item.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

function interleave(a, b) {
  const result = [];
  const maxLen = Math.max((a || []).length, (b || []).length);
  for (let i = 0; i < maxLen; i++) {
    if (a && a[i]) result.push(a[i]);
    if (b && b[i]) result.push(b[i]);
  }
  return result;
}

// Safe parallel fetch: never throws, always returns arrays
async function safeBoth(fnA, fnB) {
  const [ra, rb] = await Promise.allSettled([
    Promise.resolve().then(fnA).catch(() => []),
    Promise.resolve().then(fnB).catch(() => []),
  ]);
  return [
    ra.status === 'fulfilled' ? (ra.value || []) : [],
    rb.status === 'fulfilled' ? (rb.value || []) : [],
  ];
}

// â”€â”€ Trending â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useTrending() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const timerRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mdxList, cmkList] = await safeBoth(
        () => fetchTrending(20),
        () => comickTrending(20)
      );
      const merged = mergeManga(interleave(mdxList, cmkList), [], 40);
      setManga(merged);
      setLastUpdate(new Date());
      if (merged.length === 0) setError('No results');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, [load]);

  return { manga, loading, error, lastUpdate, refresh: load };
}

// â”€â”€ Latest â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useLatest() {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mdxList, cmkList] = await safeBoth(
        () => fetchLatest(20),
        () => comickLatest(20)
      );
      const merged = mergeManga(interleave(mdxList, cmkList), [], 40);
      setManga(merged);
      if (merged.length === 0) setError('No results');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(timerRef.current);
  }, [load]);

  return { manga, loading, error, refresh: load };
}

// â”€â”€ Category â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useCategory(categoryId) {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    safeBoth(
      () => fetchByCategory(categoryId, 20),
      () => comickByCategory(categoryId, 20)
    ).then(([mdxList, cmkList]) => {
      const merged = mergeManga(interleave(mdxList, cmkList), [], 40);
      setManga(merged);
      if (merged.length === 0) setError('No results');
    }).catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { manga, loading, error };
}

// â”€â”€ Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query || !query.trim()) { setResults([]); setLoading(false); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const [mdxList, cmkList] = await safeBoth(
          () => searchManga(query, 20),
          () => comickSearch(query, 20)
        );
        const merged = mergeManga(interleave(mdxList, cmkList), [], 40);
        setResults(merged);
        if (merged.length === 0) setError('No results found');
      } catch (e) {
        setError(e.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  return { results, loading, error };
}

// â”€â”€ Manga Detail â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useMangaDetail(mangaId) {
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mangaId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    const isComick = String(mangaId).startsWith('comick_');
    const fetcher = isComick
      ? comickDetail(mangaId.replace('comick_', ''))
      : fetchMangaDetail(mangaId);
    Promise.resolve(fetcher)
      .then(data => { setManga(data); if (!data) setError('Not found'); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [mangaId]);

  return { manga, loading, error };
}

// â”€â”€ Chapters â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useChapters(mangaId) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mangaId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    const isComick = String(mangaId).startsWith('comick_');
    const fetcher = isComick
      ? comickChapters(mangaId.replace('comick_', ''))
      : fetchChapters(mangaId);
    Promise.resolve(fetcher)
      .then(data => {
        setChapters(data || []);
        if (!data || !data.length) setError('No chapters available');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [mangaId]);

  return { chapters, loading, error };
}

// â”€â”€ Chapter Pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function useChapterPages(chapterId) {
  const [pages, setPages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chapterId) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    setPages([]);
    setTotal(0);
    const isComick = String(chapterId).startsWith('comick_ch_');
    const realId = isComick ? chapterId.replace('comick_ch_', '') : chapterId;
    const fetcher = isComick ? comickChapterPages(realId) : fetchChapterPages(realId);
    Promise.resolve(fetcher)
      .then(({ pages: p, total: t }) => {
        setPages(p || []);
        setTotal(t || 0);
        if (!p || !p.length) setError('No pages available for this chapter');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [chapterId]);

  return { pages, total, loading, error };
  }
