(async () => {
    await import('./versionConfig.js');

    const {appConfig: {publicKey}} = await import('./appConfig.js');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {

            navigator.serviceWorker.register('/sw.js')
                .then(subscribeUser)
                .catch(error => {
                    console.error('Installing Service Worker Failed', error);
                });

            document.getElementById('syncBtn').addEventListener('click', () => {
                navigator.serviceWorker.ready.then(reg => {
                    return reg.sync.register('unload');
                })
            })
        });
    }

    function subscribeUser(swRegistration) {

        const urlB64ToUint8Array = base64String => {
            const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
            const rawData = atob(base64)
            const outputArray = new Uint8Array(rawData.length)
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i)
            }
            return outputArray
        }

        const applicationServerKey = urlB64ToUint8Array(publicKey);

        swRegistration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
            .then(function (subscription) {
                console.log('POST EndPoint Info to Server:', JSON.stringify(subscription));
                return fetch('/api/subscribe', {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(subscription)
                });
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
            });

        return swRegistration;
    }

    navigator.serviceWorker.addEventListener('message', event => {
        //console.log('Service Worker Message', event);
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) {
            return
        }
        refreshing = true;

        window.alert('Site Content was changed, please reload page');
        window.location.reload();
    });

})();