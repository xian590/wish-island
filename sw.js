/* 许愿岛 · 成长岛 - 基础 Service Worker */
const CACHE_NAME = 'wish-island-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // 网络优先，失败回退缓存
  e.respondWith(
    fetch(e.request).then((res) => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone)).catch(() => {});
      return res;
    }).catch(() => {
      return caches.match(e.request).then((cached) => {
        if (cached) return cached;
        // 对带查询参数的JS/CSS请求，尝试匹配基础路径
        const url = new URL(e.request.url);
        if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname === '/') {
          return caches.match(url.pathname).then((fallback) => {
            if (fallback) return fallback;
            // 导航请求回退到首页
            if (e.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
        }
        // 导航请求回退到首页
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
