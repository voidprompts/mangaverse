export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  let decoded;
  try { decoded = decodeURIComponent(url); }
  catch(e) { return res.status(400).json({ error: 'Bad url' }); }

  // Allow MangaDex API, covers, CDN image servers, AND Comick.fun API + CDN
  const allowed = [
    'api.mangadex.org',
    'uploads.mangadex.org',
    'mangadex.network',
    'api.comick.fun',
    'meo.comick.fun',
    'meo2.comick.fun',
    'comick.fun',
  ];
  if (!allowed.some(d => decoded.includes(d))) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  // Pick correct headers depending on domain
  const isComick = decoded.includes('comick.fun');
  const headers = isComick ? {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, image/*, */*',
    'Referer': 'https://comick.fun/',
    'Origin': 'https://comick.fun',
  } : {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Referer': 'https://mangadex.org/',
    'Origin': 'https://mangadex.org',
  };

  try {
    const response = await fetch(decoded, { headers });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream: ' + response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
