export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });
  let decoded;
  try { decoded = decodeURIComponent(url); } catch(e) { return res.status(400).json({ error: 'Bad url' }); }
  if (!decoded.startsWith('https://api.mangadex.org') && !decoded.startsWith('https://uploads.mangadex.org')) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  try {
    const response = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org',
      },
    });
    if (!response.ok) return res.status(response.status).json({ error: 'Upstream: ' + response.status });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('image')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 's-maxage=86400');
      return res.status(200).send(Buffer.from(buffer));
    }
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
        }
