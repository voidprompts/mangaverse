export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url');
  const decoded = decodeURIComponent(url);
  if (!decoded.includes('mangadex')) return res.status(403).send('Not allowed');
  try {
    const response = await fetch(decoded, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org',
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
      },
    });
    if (!response.ok) return res.status(response.status).send('Upstream error');
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    return res.status(500).send('Error: ' + err.message);
  }
}
