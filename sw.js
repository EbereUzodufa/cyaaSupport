// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineItemCached = "offline.html";
const offlineItemCached = [
  // 'index.html', //I can't cache the index.html for now. I need it to make life better for me.
  'manifest.json',
  'assets/html2canvas.js',
  'CBF-web.jpg',
  'address.svg'
];

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) {
        console.log("[PWA Builder] Cached offline files during install");
        return cache.addAll(offlineItemCached);
      })
  );
});

// If any fetch fails, it will show the offline page.

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response){
      if(response) return response;
      return fetch(event.request)
      .then(function(response){
        const resp = response.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(event.request, resp);
        });
        return response;
      })            
    })
  );
});