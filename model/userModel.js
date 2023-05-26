const { default: mongoose, Mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, '该用户名已被占用'],
        minLength: [1, '用户名至少为1位'],
        maxLength: [10, '用户名至多为10位'],
        match: [/^\w+$/, '用户名只能包含字母、数字及下划线'],
        trim: true
    },
    password: {
        type: String,
        required: true,
        match: [/^[\S]{8,}$/, '密码至少为8位，且不能出现空格']
    },
    nickname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        match: [/^\w+([-+.]\w+)*@\w+([-+.]\w+)*\.\w+([-+.]\w+)*$/, '格式如：xxx@xxx.xxx'],
        default: ''
    },
    user_pic: String
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel