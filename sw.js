// 지후배틀 2 서비스 워커 — 오프라인 설치(PWA)를 지원한다.
// 네트워크 우선: 온라인이면 항상 최신본을 받아 캐시에 저장하고, 오프라인일 때만 캐시를 쓴다.
// 버전 확정 요청(?vc=)과 외부 요청(Firebase · CDN)은 건드리지 않는다.
const CACHE = 'jhbt2-v1';
const SHELL = ['./', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Firebase · jsdelivr CDN 등
  if (url.searchParams.has('vc') || request.headers.has('range')) return; // 버전 확인 요청
  const isPage = request.mode === 'navigate';
  // index.html 은 항상 네트워크 우선(새로고침 알림이 정확히 잡히도록), 실패 시에만 캐시
  event.respondWith(
    fetch(request).then(response => {
      if (response.ok && (isPage || SHELL.some(path => url.pathname.endsWith(path.replace('./', ''))))) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request.url, copy)).catch(() => {});
      }
      return response;
    }).catch(() => caches.match(request.url).then(hit => hit || Response.error()))
  );
});
