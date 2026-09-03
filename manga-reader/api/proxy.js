const https = require('https');
const http = require('http');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const raw = req.query && req.query.url ? req.query.url : null;
  if (!raw) { res.writeHead(400); res.end(JSON.stringify({ error: 'Missing url' })); return; }

  let decoded;
  try { decoded = decodeURIComponent(raw); }
  catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: 'Bad url' })); return; }

  const allowed = ['api.mangadex.org', 'uploads.mangadex.org', 'mangadex.network'];
  if (!allowed.some(function(d) { return decoded.indexOf(d) !== -1; })) {
    res.writeHead(403); res.end(JSON.stringify({ error: 'Not allowed' })); return;
  }

  var parsedUrl;
  try { parsedUrl = new URL(decoded); }
  catch(e) { res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid url' })); return; }

  var lib = parsedUrl.protocol === 'https:' ? https : http;
  var options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + (parsedUrl.search || ''),
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Referer': 'https://mangadex.org/',
      'Origin': 'https://mangadex.org'
    }
  };

  var proxyReq = lib.request(options, function(proxyRes) {
    var ct = proxyRes.headers['content-type'] || 'application/octet-stream';
    var isImage = ct.indexOf('image') !== -1;
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': ct,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': isImage ? 's-maxage=86400' : 's-maxage=60'
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', function(err) {
    try { res.writeHead(500); res.end(JSON.stringify({ error: err.message })); } catch(e) {}
  });

  proxyReq.end();
};
