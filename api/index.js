import app from '../backend/app.js';

export default function handler(req, res) {
  if (req.url && req.url.includes('index.js')) {
    req.url = req.url.replace(/\/api\/index\.js/g, '').replace(/\/index\.js/g, '');
    if (!req.url || req.url === '') req.url = '/';
  }
  return app(req, res);
}
