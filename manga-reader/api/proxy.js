// Vercel Serverless Proxy â€” handles both API and image requests from MangaDex
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  const decoded = decodeURIComponent(url);

  // Security: only allow MangaDex domains
  const allowed = [
    'https://api.mangadex.org',
    'https://uploads.mangadex.org',
  ];
  if (!allowed.some(a => decoded.startsWith(a))) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }

  const isImage = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(decoded);

  try {
    const response = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': isImage
          ? 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
          : 'application/json',
        'Referer': 'https://mangadex.org/',
        'Origin':  'https://mangadex.org',
        'sec-fetch-dest': isImage ? 'image' : 'empty',
        'sec-fetch-mode': isImage ? 'no-cors' : 'cors',
        'sec-fetch-site': 'same-site',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Upstream: ' + response.status });
    }

    const contentType = response.headers.get('content-type') || '';

    if (isImage) {
      // Stream image back
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType || 'image/jpeg');
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
      res.setHeader('Content-Length', buffer.byteLength);
      return res.status(200).send(Buffer.from(buffer));
    } else {
      // Return JSON API response
      const data = await response.json();
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error('Proxy error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
