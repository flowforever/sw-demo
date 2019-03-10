(async () => {
    const {appConfig: {publicKey}} = await import('./appConfig.js');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker Install Status', registration);

                    subscribeUser(registration);

                    if (Notification.permission === 'granted') {
                        navigator.serviceWorker.getRegistration().then(reg => {
                            reg.showNotification('Hello World');
                        });
                    }
                })
                .catch(error => {
                    console.error('Installing Service Worker Failed', error);
                });
        });
    }

    function subscribeUser(swRegistration) {

        const applicationServerKey = urlB64ToUint8Array(publicKey);

        swRegistration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
            .then(function (subscription) {
                console.log('User is subscribed:', JSON.stringify(subscription));
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err);
            });


        function urlB64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
    }
})();