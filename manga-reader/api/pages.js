export const config = { runtime: 'nodejs' };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');

  let decoded;
  try { decoded = decodeURIComponent(url); } catch(e) { return res.status(400).send('Bad url'); }

  const allowed = ['mangadex.network', 'mangadex.org', 'uploads.mangadex.org'];
  if (!allowed.some(d => decoded.includes(d))) return res.status(403).send('Not allowed');

  try {
    const response = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org',
      },
    });

    if (!response.ok) return res.status(response.status).send('Upstream: ' + response.status);

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.setHeader('Content-Length', buffer.length);
    return res.end(buffer);
  } catch (err) {
    return res.status(500).send('Error: ' + err.message);
  }
}
