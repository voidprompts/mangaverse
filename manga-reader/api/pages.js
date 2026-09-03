const https = require('https');
const http = require('http');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const raw = (req.query && req.query.url) ? req.query.url : null;
  if (!raw) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing url');
    return;
  }

  var decoded;
  try { decoded = decodeURIComponent(raw); }
  catch(e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad url');
    return;
  }

  var allowed = ['mangadex.network', 'mangadex.org', 'uploads.mangadex.org'];
  var ok = false;
  for (var i = 0; i < allowed.length; i++) {
    if (decoded.indexOf(allowed[i]) !== -1) { ok = true; break; }
  }
  if (!ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Not allowed');
    return;
  }

  var parsedUrl;
  try { parsedUrl = new URL(decoded); }
  catch(e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid url');
    return;
  }

  var lib = parsedUrl.protocol === 'https:' ? https : http;
  var options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + (parsedUrl.search || ''),
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Referer': 'https://mangadex.org/',
      'Origin': 'https://mangadex.org'
    }
  };

  var proxyReq = lib.request(options, function(proxyRes) {
    if (proxyRes.statusCode !== 200) {
      res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/plain' });
      res.end('Upstream: ' + proxyRes.statusCode);
      return;
    }
    var ct = proxyRes.headers['content-type'] || 'image/jpeg';
    res.writeHead(200, {
      'Content-Type': ct,
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=3600'
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', function(err) {
    try {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error: ' + err.message);
    } catch(e) {}
  });

  proxyReq.end();
};
