/**
 * 此文件用来做数据库的连接
 * 
 * 如果在node下操作mongodb数据，需要用到命令：mongose
 * http://www.mongoosejs.net/
 */

const mongoose = require('mongoose');
// 连接mongodb数据库
mongoose.connect('mongodb://localhost:27017/user', {
    useNewUrlParser: true,     // 新的解析器
    useUnifiedTopology: true,  // 新的引擎
    useCreateIndex: true,      // 定义索引
    poolSize: 5                // 连接池
});

module.exports = mongoose;
