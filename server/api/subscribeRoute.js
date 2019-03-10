const Router = require('koa-router');

const subscribeRoute = new Router({
    prefix: '/api/subscribe'
});

subscribeRoute.post('/', ctx => {
    ctx.body = 'success';
});

subscribeRoute.get('/', ctx => {
    ctx.body = 'ok';
});

module.exports.subscribeRoute = subscribeRoute;