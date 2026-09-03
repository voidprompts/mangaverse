const https = require('https');
const http = require('http');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { url: imgUrl } = req.query;
  if (!imgUrl) { res.status(400).send('Missing url'); return; }

  let decoded;
  try { decoded = decodeURIComponent(imgUrl); }
  catch(e) { res.status(400).send('Bad url'); return; }

  const allowed = ['mangadex.network', 'mangadex.org', 'uploads.mangadex.org'];
  if (!allowed.some(d => decoded.includes(d))) { res.status(403).send('Not allowed'); return; }

  try {
    const parsedUrl = new URL(decoded);
    const lib = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://mangadex.org/',
        'Origin': 'https://mangadex.org',
      },
    };

    const proxyReq = lib.request(options, (proxyRes) => {
      if (proxyRes.statusCode !== 200) {
        res.status(proxyRes.statusCode).send('Upstream: ' + proxyRes.statusCode);
        return;
      }
      const contentType = proxyRes.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
      res.status(200);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.status(500).send('Proxy error: ' + err.message);
    });

    proxyReq.end();
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
};
