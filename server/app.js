const Koa = require('koa');
const koaStatic = require('koa-static');
const koaLogger = require('koa-logger');

const {subscribeRoute} = require("./api/subscribeRoute");


const app = new Koa();
const PORT = 9080;

app.use(koaLogger());
app.use(koaStatic('./src'));

app.use(subscribeRoute.routes());

app.listen(PORT);
console.log('App listen on', PORT);