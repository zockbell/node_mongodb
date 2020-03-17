const Router = require('koa-router');
const router = new Router();
const { User } = require('../models/user');

// 路由前缀
router.prefix('/api/user');

router.get('/', ctx => {
    ctx.body = "用户主页";
})

// 查询用户
router.get('/refer', async ctx => {
    ctx.body = await User.find();
});

// 注册
router.post('/register', async ctx => {
    const { username, password } = ctx.request.body;
    if(password.length < 6) {
        // console.log('密码不能小于6位');
        return ctx.body = {
            retult: false,
            errcode: 102,
            errmsg: "密码不能小于6位"
        }
    } else {
        const user = await User.create({
            username,
            password
        })
    }
})

// 登录
router.post('/login', async ctx => {
    // ctx.body = '登录'
    const {username, password} = ctx.request.body;
    // console.log(username, password);
    // 登录逻辑先判断用户名是否存在，之后再比对密码
    const user = await User.findOne({
        username
    })

    // console.log(user);

    // 用户名不存在
    if(!user) {
        return ctx.body = {
            retult: false,
            errcode: 100,
            errmsg: "用户名不存在"
        }
    }

    // 用户名存在，并去查询数据库作密码比对
    const userPass = await User.findOne({
        username,
        password
    });

    // console.log(userPass);
    if(!userPass) {
        return ctx.body = {
            retult: false,
            errcode: 101,
            errmsg: "用户名或密码错误"
        }
    } else {
        return ctx.body = {
            retult: true,
            errcode: 110,
            errmsg: "登录成功"
        }
    }

    // 用户名存在，并去查询数据库作密码比对
    // if(user) {
    //     return ctx.body = {
    //         errcode: 110,
    //         errmsg: "登录成功"
    //     }
    // }

    

})

module.exports = router;