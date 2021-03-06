this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v3')
      .then(cache => {
        return cache.addAll([
          '/',
          '/js/scripts.js',
          '/css/styles.css',
          '/assets/color-palette.svg',
          '/assets/delete-icon.svg',
          '/assets/padlock.svg',
          '/assets/unlock.svg'
        ]);
      })
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

this.addEventListener('activate', event => {
  let cacheKeep = ['assets-v3'];
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (cacheKeep.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
