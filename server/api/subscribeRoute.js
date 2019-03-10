const Router = require('koa-router');
const webPush = require('web-push');

const pushkey = require('../../pushkey');

webPush.setVapidDetails(
    'mailto:trump.wang@ringcentral.com',
    pushkey.publicKey,
    pushkey.privateKey,
);

const subscribeRoute = module.exports.subscribeRoute = new Router({
    prefix: '/api/subscribe'
});

subscribeRoute.post('/', ctx => {
    ctx.body = ctx.request.body;
    ctx.session.subscribeInfo = ctx.request.body;
});

subscribeRoute.get('/', ctx => {
    const {subscribeInfo = {}} = ctx.session;
    ctx.body = subscribeInfo;

    const payload = {
        title: 'Service Web',
        body: 'RingCentral Service Web 批处理完成了',
        icon: '/html/app-manifest/logo_512.png',
        data: {url: "https://service.ringcentra.com"},
    };

    webPush.sendNotification(subscribeInfo, JSON.stringify(payload));
});