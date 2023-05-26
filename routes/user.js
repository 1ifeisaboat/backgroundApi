const express = require('express')
const userModel = require('../model/userModel')
const bcrypt = require('bcryptjs')
// const multer = require('multer')
// const path = require('path')

const router = express.Router()
// const upload = multer({ dest: path.resolve(__dirname, '../uploads/user') })

router.get('/userinfo', (req, res) => {
    userModel.findById(req.auth._id).select({ password: 0 })
        .then(value => {
            console.log(value)
            if (!value) {
                throw new Error('用户不存在')
            }
            res.cc(`获取${req.auth.username}用户信息成功`, value)
        }).catch(error => {
            console.log(error)
            res.cc(error.message, null, '2001')
        })
})
router.post('/userinfo', (req, res) => {
    if (req.body.password || req.body.user_pic) {
        throw new Error('只能修改用户基本信息，修改密码请使用/userinfo/password，修改用户头像请使用/userinfo/userpic')
    }
    userModel.updateOne({ _id: req.auth._id }, { $set: { ...req.body } })
        .then(value => {
            console.log(value)
            if (value.modifiedCount !== 1) {
                throw new Error('修改值不能与原值相同')
            }
            res.cc('', value)
        }).catch(error => {
            console.log(error)
            res.cc(error.message, null, '2002')
        })
})

router.post('/userinfo/password', (req, res) => {
    userModel.findById(req.auth._id)
        .then(value => {
            console.log(req.body)
            if (req.body.newPwd.length < 8) {
                throw new Error('密码至少为8位，且不能出现空格')
            }
            if (bcrypt.compareSync(req.body.newPwd, value.password)) {
                throw new Error('新密码与原密码一致，请修改')
            }
            req.body.password = bcrypt.hashSync(req.body.newPwd, 10)
            console.log(req.body)
            return userModel.updateOne({ _id: req.auth._id }, { $set: { password: req.body.password } })
        }).then(value => {
            console.log(value)
            res.cc('修改密码成功', {})
        }).catch(error => {
            console.log(error)
            res.cc(error.message, null, '2003')
        })
})
router.post('/userinfo/userpic', (req, res) => {
    console.log(req.body)
    userModel.updateOne({ _id: req.auth._id }, { $set: { user_pic: req.body.avatar } })
        .then(value => {
            console.log(value)
            res.cc('用户头像修改成功', {})
        }).catch(error => {
            console.log(error)
            res.cc(error.message, null, '2004')
        })
})

module.exports = router