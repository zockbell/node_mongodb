// 对数据库的一些操作
const mongoose = require('../libs/db');
// const bcrypt = require('bcrypt');

// 定义规则
// var salt = bcrypt.genSaltSync(10);  //---散列10位长度，太长浪费性能没必要，过少的话，那么安全性又是个问题
// var hash = bcrypt.hashSync(val, salt);  //---获得加密的 hash 密码

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
})

// 使用规则
const User = mongoose.model('User', UserSchema);

module.exports = { User };