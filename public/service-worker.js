this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1')
      .then(cache => {
        return cache.addAll([
          '/',
          '/js/scripts.js',
          '/css/styles.css',
          '/lib/jquery-3.2.1.js',
          '/img/color-palette.svg',
          '/img/delete-icon.svg',
          '/img/padlock.svg',
          '/img/unlock.svg',
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
  let cacheKeep = ['assets-v1'];
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
