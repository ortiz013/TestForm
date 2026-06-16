/* UG Field Reports — offline service worker.
   Host this file next to the form HTML (same folder). It caches the app shell
   so the form opens with no internet after the first visit. */
var CACHE = 'ug-field-reports-v1';
self.addEventListener('install', function (e) {
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy).catch(function(){}); });
        return res;
      }).catch(function () { return caches.match('./'); });
    })
  );
});
