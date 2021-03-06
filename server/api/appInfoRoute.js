const Router = require('koa-router');
const package = require('../../package');

const appInfoRoute = module.exports.appInfoRoute = new Router({
    prefix: '/api/app-info'
});

appInfoRoute.get('/', ctx => {
    ctx.body = {
        version: package.version,
    };
});


appInfoRoute.get('/sync', ctx=>{
    ctx.body = 'sync success';
});

appInfoRoute.get('/random', ctx=> ctx.body = Math.random());