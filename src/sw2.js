const version = '2.0.0';

const preCacheList = [
    '/',

    '/index.html',

    '/main.js',

    '/app.css',

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
    const isNavigateMode = mode === 'navigate'

    event.respondWith(
        caches.match(request)
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
    return caches.match('/index.html');
}