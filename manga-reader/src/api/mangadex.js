// MangaDex API â€” all requests go through our Vercel proxy
const BASE  = 'https://api.mangadex.org';
const COVER = 'https://uploads.mangadex.org/covers';
const PROXY       = '/api/proxy?url=';
const PAGES_PROXY = '/api/pages?url=';

export const TAG_MAP = {
  'action':     '391b0423-d847-456f-aff0-8b0cfc03066b',
  'romance':    '423e2eae-a447-4741-a19f-6a07c62de58f',
  'fantasy':    'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
  'horror':     'cdad7e68-1419-41dd-bdce-27753074a640',
  'comedy':     '4d32cc48-9f00-4cca-9b5a-a839f0764984',
  'scifi':      '256c8bd9-4904-4360-bf4f-508a76d67183',
  'slice':      'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
  'sports':     '69964a64-2f90-4d33-beeb-f3ed2875eb4c',
  'mecha':      'a1f53773-c69a-4ce5-8cab-fffcd90b1565',
  'isekai':     'ace04997-f6bd-436e-b261-779182193d3d',
  'mystery':    'ee968100-4191-4968-93d3-f82d72be7e46',
  'historical': 'a9cb0326-d6d2-4753-9a84-bd3d3c91a9d7',
};

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function coverUrl(mangaId, filename) {
  if (!mangaId || !filename) return null;
  const direct = `${COVER}/${mangaId}/${filename}.512.jpg`;
  return PROXY + encodeURIComponent(direct);
}

function extractCover(manga) {
  const rel = (manga.relationships || []).find(r => r.type === 'cover_art');
  return rel?.attributes?.fileName ? coverUrl(manga.id, rel.attributes.fileName) : null;
}

function extractAuthor(manga) {
  const rel = (manga.relationships || []).find(r => r.type === 'author');
  return rel?.attributes?.name || 'Unknown';
}

function getTitle(manga) {
  const t = manga.attributes?.title || {};
  return t.en || t['ja-ro'] || t.ja || Object.values(t)[0] || 'Untitled';
}

function getDesc(manga) {
  const d = manga.attributes?.description || {};
  return d.en || Object.values(d)[0] || 'No description available.';
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 60) return mins  + 'm ago';
  if (hours < 24) return hours + 'h ago';
  return days + 'd ago';
}

function fmt(manga, extra = {}) {
  return {
    id:         manga.id,
    title:      getTitle(manga),
    author:     extractAuthor(manga),
    cover:      extractCover(manga),
    desc:       getDesc(manga),
    chapters:   manga.attributes?.lastChapter || '?',
    rating:     (manga.attributes?.rating?.bayesian || 0).toFixed(1),
    views:      'N/A',
    status:     manga.attributes?.status || 'ongoing',
    tags:       (manga.attributes?.tags || []).map(t => t.attributes?.name?.en).filter(Boolean),
    updated:    timeAgo(manga.attributes?.updatedAt),
    isNew:      false,
    isTrending: false,
    source:     'mangadex',
    ...extra,
  };
}

// â”€â”€ Core API fetch through proxy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function apiFetch(path) {
  const url  = PROXY + encodeURIComponent(BASE + path);
  const ctrl = new AbortController();
  const t    = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    clearTimeout(t);
    throw err;
  }
}

// â”€â”€ Public API functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function fetchTrending(limit = 20) {
  try {
    const path = `/manga?limit=${limit}&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true&availableTranslatedLanguage[]=en`;
    const data = await apiFetch(path);
    return (data.data || []).map((m, i) => fmt(m, { isTrending: true, trendingRank: i + 1 }));
  } catch (err) { console.warn('fetchTrending:', err.message); return []; }
}

export async function fetchLatest(limit = 20) {
  try {
    const path = `/manga?limit=${limit}&order[latestUploadedChapter]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true&availableTranslatedLanguage[]=en`;
    const data = await apiFetch(path);
    return (data.data || []).map(m => fmt(m, { isNew: true }));
  } catch (err) { console.warn('fetchLatest:', err.message); return []; }
}

export async function fetchByCategory(categoryId, limit = 20) {
  const tagId = TAG_MAP[categoryId];
  if (!tagId) return [];
  try {
    const path = `/manga?limit=${limit}&includedTags[]=${tagId}&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true&availableTranslatedLanguage[]=en`;
    const data = await apiFetch(path);
    return (data.data || []).map(m => fmt(m));
  } catch (err) { console.warn('fetchByCategory:', err.message); return []; }
}

export async function searchManga(query, limit = 20) {
  if (!query?.trim()) return [];
  try {
    const path = `/manga?limit=${limit}&title=${encodeURIComponent(query.trim())}&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true`;
    const data = await apiFetch(path);
    return (data.data || []).map(m => fmt(m));
  } catch (err) { console.warn('searchManga:', err.message); return []; }
}

export async function fetchMangaDetail(mangaId) {
  try {
    const data = await apiFetch(`/manga/${mangaId}?includes[]=cover_art&includes[]=author`);
    return fmt(data.data);
  } catch (err) { console.warn('fetchMangaDetail:', err.message); return null; }
}


export async function fetchChapters(mangaId, limit = 96) {
  try {
    const path = `/manga/${mangaId}/feed?limit=${limit}&translatedLanguage[]=en&order[chapter]=asc&contentRating[]=safe&contentRating[]=suggestive`;
    const data = await apiFetch(path);
    const all  = data.data || [];

    // Filter: only chapters with actual pages (no externalUrl, pages > 0)
    const readable = all.filter(ch =>
      !ch.attributes?.externalUrl &&
      (ch.attributes?.pages || 0) > 0
    );

    // If no readable chapters, include all (fallback)
    const list = readable.length > 0 ? readable : all;

    return list.map(ch => ({
      id:       ch.id,
      num:      ch.attributes?.chapter || '?',
      title:    ch.attributes?.title || 'Chapter ' + (ch.attributes?.chapter || '?'),
      pages:    ch.attributes?.pages || 0,
      date:     timeAgo(ch.attributes?.publishAt),
      hasPages: !ch.attributes?.externalUrl && (ch.attributes?.pages || 0) > 0,
    }));
  } catch (err) { console.warn('fetchChapters:', err.message); return []; }
}

export async function fetchStats(mangaId) {
  try {
    const data = await apiFetch(`/statistics/manga/${mangaId}`);
    const s    = data.statistics?.[mangaId];
    return { rating: s?.rating?.bayesian?.toFixed(1) || 'N/A', follows: s?.follows || 0 };
  } catch { return { rating: 'N/A', follows: 0 }; }
}
