const cacheName = 'main-9.1.0';

const preCacheList = [
    '/',

    '/index.html',

    '/main.js',

    '/css/app.css',

    '/images/offline-support.png'
];

self.addEventListener('install', (event) => {
    console.log(`[Service Worker] install`);

    event.waitUntil(
        caches.open(cacheName)
            .then(caches => caches.addAll(preCacheList))
    );

});

self.addEventListener('activate', async () => {
    console.log('[Service Worker] active');
    self.clients.claim();
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
        caches.open(cacheName)
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
    //util.postMessage(notificationData);
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


function fallbackIndexHtml() {
    return caches.match('/index.html');
}