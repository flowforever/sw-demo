const version = '3.0.0';

const preCacheList = [
    '/',

    '/index.html',

    '/main.js',

    '/css/app.css',

    '/images/offline-support.png'
];

self.addEventListener('install', (event) => {
    console.log(`Version ${version} is installing.`);

    event.waitUntil(
        caches.open(version)
            .then(caches => caches.addAll(preCacheList))
    );

});

self.addEventListener('activate', async () => {
});

self.addEventListener('fetch', (event) => {
    const {request} = event;
    const {mode} = request;
    const isNavigateMode = mode === 'navigate';

    event.respondWith(
        caches.match(request)
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

self.addEventListener('push', event=>{
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let notificationData = event.data.json();
    const title = notificationData.title;
    // 可以发个消息通知页面
    //util.postMessage(notificationData);
    // 弹消息框
    event.waitUntil(self.registration.showNotification(title, notificationData));
});


function fallbackIndexHtml() {
    return caches.match('/index.html');
}