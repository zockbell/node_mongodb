const Koa = require('koa');
const Router = require('koa-router');
const users = require('./routers/user');
const body = require('koa-bodyparser');
const error = require('./middleware/error');

const app = new Koa();
app.use(body());
app.use(error);

const router = new Router();
router.get('/', ctx => {
    ctx.body = '主页';
})

app.use(router.routes());

// 官方推荐，丰富响应头
app.use(users.routes(), users.allowedMethods());
app.listen(3000, () => {
    console.log('http://localhost:3000');
});
