/**
 * 为了开发方便，自己定义中间件用来处理服务器错误
 * 正式环境不需要，否则黑客会抓取攻击
 * @param {*} ctx 
 * @param {*} next 
 */
const error = async (ctx, next) => {
    // 复用KOA的洋葱模型捕获
    try {
        await next();
    } catch (error) {
        ctx.body = {
            message: "服务器出错",
            error: error.message
        }
    }
}

module.exports = error;
