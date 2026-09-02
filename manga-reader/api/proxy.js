export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });
  const decoded = decodeURIComponent(url);
  if (!decoded.startsWith('https://api.mangadex.org')) {
    return res.status(403).json({ error: 'Only MangaDex allowed' });
  }
  try {
    const response = await fetch(decoded, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'MangaVerse/1.0' },
    });
    if (!response.ok) return res.status(response.status).json({ error: 'Upstream error' });
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
