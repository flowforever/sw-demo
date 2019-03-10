const Koa = require('koa');
const koaStatic = require('koa-static');
const koaLogger = require('koa-logger');
const koaBodyParser = require('koa-bodyparser');
const koaSession = require('koa-session');

const {subscribeRoute} = require("./api/subscribeRoute");
const {appInfoRoute} = require("./api/appInfoRoute");


const app = new Koa();
const PORT = 9081;

app.keys = ['some secret hurr'];

const sessionConfig = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


app.use(koaLogger());
app.use(koaStatic('./src'));
app.use(koaBodyParser());
app.use(koaSession(sessionConfig, app));

app.use(subscribeRoute.routes());
app.use(appInfoRoute.routes());

app.listen(PORT);
console.log('App listen on', PORT);