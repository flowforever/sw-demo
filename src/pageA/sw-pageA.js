const cacheName = '1.0.0';

const preCacheList = [
    '/',

    '/pageA/index.html',

    '/main.js',

    '/css/app.css',

    '/images/only-only.png'
];

self.addEventListener('install', (event) => {
    console.log(`Version ${cacheName} is installing.`);

    event.waitUntil(
        caches.open(cacheName)
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
        caches.open(cacheName)
            .then(caches=> caches.match(request))
            .then(response => {
                return response ? response : fetch(request);
            })
            .then(res=>{
                console.log('Fetch res',res);

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


function fallbackIndexHtml() {
    return caches.match('/pageA/index.html');
}