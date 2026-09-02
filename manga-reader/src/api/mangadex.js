// ── MangaDex API Integration ─────────────────────────────────────────────────
// Docs: https://api.mangadex.org/docs
// Free, no API key needed!

const BASE_URL = 'https://api.mangadex.org';
const COVER_URL = 'https://uploads.mangadex.org/covers';

// MangaDex tag IDs mapped to our category system
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function getCoverUrl(mangaId, filename) {
  if (!filename) return null;
  return `${COVER_URL}/${mangaId}/${filename}.256.jpg`;
}

function extractCover(manga) {
  const rel = manga.relationships?.find(r => r.type === 'cover_art');
  const filename = rel?.attributes?.fileName;
  return getCoverUrl(manga.id, filename);
}

function extractAuthor(manga) {
  const rel = manga.relationships?.find(r => r.type === 'author');
  return rel?.attributes?.name || 'Unknown Author';
}

function getTitle(manga) {
  const t = manga.attributes?.title;
  return t?.en || t?.['ja-ro'] || t?.ja || Object.values(t || {})[0] || 'Untitled';
}

function getDesc(manga) {
  const d = manga.attributes?.description;
  return d?.en || Object.values(d || {})[0] || 'No description available.';
}

function formatManga(manga) {
  return {
    id:         manga.id,
    title:      getTitle(manga),
    author:     extractAuthor(manga),
    cover:      extractCover(manga),
    desc:       getDesc(manga),
    chapters:   manga.attributes?.lastChapter || '?',
    rating:     (manga.attributes?.rating?.bayesian || 0).toFixed(1),
    views:      manga.attributes?.follows
                  ? (manga.attributes.follows > 1000000
                      ? (manga.attributes.follows / 1000000).toFixed(1) + 'M'
                      : (manga.attributes.follows / 1000).toFixed(0) + 'K')
                  : 'N/A',
    status:     manga.attributes?.status || 'ongoing',
    year:       manga.attributes?.year,
    tags:       manga.attributes?.tags?.map(t =>
                  t.attributes?.name?.en).filter(Boolean) || [],
    updated:    manga.attributes?.updatedAt
                  ? timeAgo(manga.attributes.updatedAt)
                  : 'Recently',
    isNew:      isNewManga(manga.attributes?.createdAt),
    isTrending: false, // set by caller
    source:     'mangadex',
  };
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function isNewManga(dateStr) {
  if (!dateStr) return false;
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 30 * 24 * 60 * 60 * 1000; // within 30 days
}

// ── API Calls ────────────────────────────────────────────────────────────────

// Fetch trending/popular manga
export async function fetchTrending(limit = 20) {
  try {
    const params = new URLSearchParams({
      limit,
      order: JSON.stringify({ followedCount: 'desc' }),
      contentRating: ['safe', 'suggestive'],
      includes: ['cover_art', 'author'],
      hasAvailableChapters: true,
    });

    const res = await fetch(
      `${BASE_URL}/manga?limit=${limit}&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.data.map((m, i) => ({ ...formatManga(m), isTrending: true, trendingRank: i + 1 }));
  } catch (err) {
    console.error('MangaDex trending error:', err);
    return [];
  }
}

// Fetch latest/recently updated manga
export async function fetchLatest(limit = 20) {
  try {
    const res = await fetch(
      `${BASE_URL}/manga?limit=${limit}&order[latestUploadedChapter]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.data.map(m => ({ ...formatManga(m), isNew: true }));
  } catch (err) {
    console.error('MangaDex latest error:', err);
    return [];
  }
}

// Fetch manga by category/tag
export async function fetchByCategory(categoryId, limit = 20) {
  const tagId = TAG_MAP[categoryId];
  if (!tagId) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/manga?limit=${limit}&includedTags[]=${tagId}&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.data.map(m => formatManga(m));
  } catch (err) {
    console.error('MangaDex category error:', err);
    return [];
  }
}

// Search manga by title
export async function searchManga(query, limit = 20) {
  if (!query?.trim()) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/manga?limit=${limit}&title=${encodeURIComponent(query)}&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art&includes[]=author&hasAvailableChapters=true`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.data.map(m => formatManga(m));
  } catch (err) {
    console.error('MangaDex search error:', err);
    return [];
  }
}

// Fetch single manga details
export async function fetchMangaDetail(mangaId) {
  try {
    const res = await fetch(
      `${BASE_URL}/manga/${mangaId}?includes[]=cover_art&includes[]=author&includes[]=artist`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return formatManga(data.data);
  } catch (err) {
    console.error('MangaDex detail error:', err);
    return null;
  }
}

// Fetch chapters list for a manga
export async function fetchChapters(mangaId, limit = 30, offset = 0) {
  try {
    const res = await fetch(
      `${BASE_URL}/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=en&order[chapter]=desc&contentRating[]=safe&contentRating[]=suggestive`
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.data.map(ch => ({
      id:      ch.id,
      num:     ch.attributes?.chapter || '?',
      title:   ch.attributes?.title || `Chapter ${ch.attributes?.chapter || '?'}`,
      pages:   ch.attributes?.pages || 0,
      date:    timeAgo(ch.attributes?.publishAt),
      lang:    ch.attributes?.translatedLanguage,
      scanlator: ch.relationships?.find(r => r.type === 'scanlation_group')?.attributes?.name || 'Unknown',
    }));
  } catch (err) {
    console.error('MangaDex chapters error:', err);
    return [];
  }
}

// Fetch actual page images for a chapter
export async function fetchChapterPages(chapterId) {
  try {
    const res = await fetch(`${BASE_URL}/at-home/server/${chapterId}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    const baseUrl  = data.baseUrl;
    const hash     = data.chapter?.hash;
    const pages    = data.chapter?.data || [];        // high quality
    const pagesSaver = data.chapter?.dataSaver || []; // compressed

    return {
      // Use dataSaver (smaller) for mobile — swap to 'data' for full quality
      pages: pagesSaver.map((filename, i) => ({
        index: i + 1,
        url:   `${baseUrl}/data-saver/${hash}/${filename}`,
        urlHQ: `${baseUrl}/data/${hash}/${pages[i] || filename}`,
      })),
      total: pagesSaver.length,
    };
  } catch (err) {
    console.error('MangaDex pages error:', err);
    return { pages: [], total: 0 };
  }
}

// Fetch manga statistics (ratings, follows)
export async function fetchStats(mangaId) {
  try {
    const res = await fetch(`${BASE_URL}/statistics/manga/${mangaId}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const stats = data.statistics?.[mangaId];
    return {
      rating:  stats?.rating?.bayesian?.toFixed(1) || 'N/A',
      follows: stats?.follows || 0,
    };
  } catch (err) {
    return { rating: 'N/A', follows: 0 };
  }
}
