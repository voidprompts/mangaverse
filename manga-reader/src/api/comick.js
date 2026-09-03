// Comick.fun API â€” second source for manga not on MangaDex (Solo Leveling, OPM, etc.)
// All requests routed through /api/proxy to bypass CORS

const COMICK = 'https://api.comick.fun';
const PROXY = '/api/proxy?url=';

function comickFetch(path) {
  const url = PROXY + encodeURIComponent(COMICK + path);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  return fetch(url, { signal: ctrl.signal })
    .then(res => { clearTimeout(t); if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .catch(err => { clearTimeout(t); throw err; });
}

function formatComickManga(m, extra) {
  extra = extra || {};
  // Comick cover images are hosted at meo.comick.fun or meo2.comick.fun
  const coverPath = m.md_covers && m.md_covers[0] ? m.md_covers[0].b2key || m.md_covers[0].gpurl : null;
  const cover = coverPath
    ? PROXY + encodeURIComponent('https://meo.comick.fun/' + coverPath)
    : null;

  const title = (m.title || m.md_titles && m.md_titles[0] && m.md_titles[0].title) || 'Untitled';
  const slug = m.slug || m.hid || '';
  const hid = m.hid || '';

  return Object.assign({
    id: 'comick_' + hid,
    hid: hid,
    slug: slug,
    title: title,
    author: m.author || m.mu_comics && m.mu_comics[0] && m.mu_comics[0].mu_comic_categories ? '' : 'Unknown',
    cover: cover,
    desc: m.desc || m.mu_comics && m.mu_comics[0] && m.mu_comics[0].summary ? m.mu_comics[0].summary : 'No description.',
    chapters: m.chapter_count || m.last_chapter || '?',
    rating: m.rating ? parseFloat(m.rating).toFixed(1) : 'N/A',
    views: m.view_count ? (m.view_count > 1000000 ? (m.view_count / 1000000).toFixed(1) + 'M' : m.view_count > 1000 ? (m.view_count / 1000).toFixed(0) + 'K' : m.view_count) : 'N/A',
    status: m.status === 1 ? 'ongoing' : m.status === 2 ? 'completed' : 'ongoing',
    tags: m.md_comic_md_genres ? m.md_comic_md_genres.map(g => g.md_genres && g.md_genres.name).filter(Boolean) : [],
    updated: m.last_chapter ? 'Ch.' + m.last_chapter : 'Recently',
    isNew: false,
    isTrending: false,
    source: 'comick',
  }, extra);
}

export async function comickSearch(query, limit) {
  limit = limit || 20;
  if (!query || !query.trim()) return [];
  try {
    const path = '/v1.0/search/?q=' + encodeURIComponent(query.trim()) + '&limit=' + limit + '&page=1&tachiyomi=true';
    const data = await comickFetch(path);
    if (!Array.isArray(data)) return [];
    return data.map(m => formatComickManga(m));
  } catch (err) {
    console.warn('comickSearch:', err.message);
    return [];
  }
}

export async function comickTrending(limit) {
  limit = limit || 20;
  try {
    const path = '/v1.0/search/?sort=follow&page=1&limit=' + limit + '&tachiyomi=true&type=manga';
    const data = await comickFetch(path);
    if (!Array.isArray(data)) return [];
    return data.map((m, i) => formatComickManga(m, { isTrending: true, trendingRank: i + 1 }));
  } catch (err) {
    console.warn('comickTrending:', err.message);
    return [];
  }
}

export async function comickLatest(limit) {
  limit = limit || 20;
  try {
    const path = '/v1.0/search/?sort=uploaded&page=1&limit=' + limit + '&tachiyomi=true&type=manga';
    const data = await comickFetch(path);
    if (!Array.isArray(data)) return [];
    return data.map(m => formatComickManga(m, { isNew: true }));
  } catch (err) {
    console.warn('comickLatest:', err.message);
    return [];
  }
}

// Genre mapping for Comick (genre IDs from their API)
const COMICK_GENRE_MAP = {
  action: 1,
  romance: 32,
  fantasy: 10,
  horror: 17,
  comedy: 4,
  scifi: 34,
  slice: 36,
  sports: 38,
  mecha: 25,
  isekai: 51,
  mystery: 28,
  historical: 16,
};

export async function comickByCategory(categoryId, limit) {
  limit = limit || 20;
  const genreId = COMICK_GENRE_MAP[categoryId];
  if (!genreId) return [];
  try {
    const path = '/v1.0/search/?genre=' + genreId + '&sort=follow&page=1&limit=' + limit + '&tachiyomi=true';
    const data = await comickFetch(path);
    if (!Array.isArray(data)) return [];
    return data.map(m => formatComickManga(m));
  } catch (err) {
    console.warn('comickByCategory:', err.message);
    return [];
  }
}

export async function comickDetail(hid) {
  // hid is the comick internal id (without 'comick_' prefix)
  if (!hid) return null;
  try {
    const path = '/comic/' + hid;
    const data = await comickFetch(path);
    const comic = data.comic || data;
    return formatComickManga(comic);
  } catch (err) {
    console.warn('comickDetail:', err.message);
    return null;
  }
}

export async function comickChapters(hid, limit) {
  limit = limit || 96;
  if (!hid) return [];
  try {
    const path = '/comic/' + hid + '/chapters?lang=en&limit=' + limit + '&page=1';
    const data = await comickFetch(path);
    const chapters = data.chapters || [];
    return chapters
      .filter(ch => ch.hid)
      .map(ch => ({
        id: 'comick_ch_' + ch.hid,
        hid: ch.hid,
        num: ch.chap || '?',
        title: ch.title || ('Chapter ' + (ch.chap || '?')),
        pages: ch.images ? ch.images.length : 0,
        date: ch.updated_at ? timeAgo(ch.updated_at) : 'Recently',
        hasPages: true,
      }));
  } catch (err) {
    console.warn('comickChapters:', err.message);
    return [];
  }
}

export async function comickChapterPages(chapterHid) {
  if (!chapterHid) return { pages: [], total: 0 };
  try {
    const path = '/chapter/' + chapterHid + '?tachiyomi=true';
    const data = await comickFetch(path);
    const images = data.chapter && data.chapter.images ? data.chapter.images : data.images || [];
    if (!images.length) return { pages: [], total: 0 };
    const pages = images.map((img, i) => {
      const imgUrl = img.url || ('https://meo.comick.fun/' + (img.b2key || img.gpurl || ''));
      return {
        index: i + 1,
        url: PROXY + encodeURIComponent(imgUrl),
        urlHQ: PROXY + encodeURIComponent(imgUrl),
      };
    });
    return { pages, total: pages.length };
  } catch (err) {
    console.warn('comickChapterPages:', err.message);
    return { pages: [], total: 0 };
  }
}

function timeAgo(s) {
  if (!s) return 'Recently';
  const d = Date.now() - new Date(s).getTime();
  const mn = Math.floor(d / 60000);
  const h = Math.floor(d / 3600000);
  const dy = Math.floor(d / 86400000);
  if (mn < 60) return mn + 'm ago';
  if (h < 24) return h + 'h ago';
  return dy + 'd ago';
  }
