const cacheVersionName = '1.0.6';

const preCacheList = [
    '/',

    '/index.html',

    '/main.js',

    '/css/app.css',

    '/images/offline-support.png'
];

self.addEventListener('install', (event) => {
    console.log(`[Service Worker] install ${cacheVersionName}`);
    self.skipWaiting(); // 立即使用用该版本接管 fetch push sync 等

    self.clients.claim();

    event.waitUntil(
        caches.open(cacheVersionName)
            .then(cache => cache.addAll(preCacheList))
    );

});

self.addEventListener('activate', async () => {
    console.log('[Service Worker] active');

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (name) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin

                    return name !== cacheVersionName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {

    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'fetch',
                url: event.request.url,
            });
        })
    })

    const {request} = event;
    const {mode} = request;
    const isNavigateMode = mode === 'navigate';

    event.respondWith(
        caches.open(cacheVersionName)
            .then(caches => caches.match(request))
            .then(response => {
                return response ? response : fetch(request);
            })
            .then(res=>{
                //console.log('Fetch res',res);

                if (res.status === 404 && isNavigateMode) {
                    return fallbackIndexHtml();
                }

                return res;
            })
            .catch(error => {
                if (isNavigateMode) {
                    return fallbackIndexHtml();
                }
            })
    )
});

self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let notificationData = event.data.json();
    const title = notificationData.title;
    // 可以发个消息通知页面
    //clients forEach postMessage(notificationData);
    // 弹消息框
    event.waitUntil(self.registration.showNotification(title, notificationData));
});

self.addEventListener('sync', (event) => {
    const {tag} = event;
    if(tag === 'unload') {
        event.waitUntil(
            fetch('/api/app-info/sync?userId=trump.wang')
        )
    }
});

// receive postMessage from window
self.addEventListener('message', () => {

});


function fallbackIndexHtml() {
    return caches.match('/index.html');
}