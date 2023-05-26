const express = require('express')
const userModel = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/config')


const router = express.Router()

router.post('/reg', (req, res) => {
    userModel.create(req.body)
        .then(value => {
            return userModel.updateOne({ username: value.username },
                {
                    $set: {
                        password: bcrypt.hashSync(value.password, 10)
                    }
                })
        }).then(value => {
            console.log(value)
            /* res.json({
                code: '0000',
                msg: '注册成功',
                data: { ...req.body, password: '' }
            }) */
            res.cc(`注册成功 ${value.username}`, { ...req.body, password: '' })
        }).catch(error => {
            console.log(error)
            /* res.json({
                code: '1001',
                msg: error.message,
                data: null
            }) */
            res.cc(error.message, null, '1001')
        })
})

router.post('/login', (req, res) => {
    userModel.findOne({
        username: req.body.username
    }).then(value => {
        console.log(value)
        if (!value) {
            throw new Error('用户不存在，请检查用户名是否正确')
        }
        if (!bcrypt.compareSync(req.body.password, value.password)) {
            throw new Error('密码错误，请重新输入')
        }
        const token = jwt.sign({
            username: value.username,
            _id: value._id
        }, secret, {
            expiresIn: 60 * 60 * 24 * 7
        })
        res.cc(`登录成功 ${value.username}`, `Bearer ${token}`)
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '1002')
    })
})

module.exports = router