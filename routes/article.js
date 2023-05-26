const express = require('express')
const articleModel = require('../model/articleModel')
const multer = require('multer')
const path = require('path')
const moment = require('moment')

const router = express.Router()
const upload = multer({ dest: path.resolve(__dirname, '../uploads/article') })

router.get('/', (req, res) => {
    articleModel.find({ is_del: false }).then(value => {
        console.log(value)
        res.cc('获取文章成功', value)
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '4001')
    })
})

router.post('/add', upload.single('cover_img'), (req, res) => {
    if (!req.file || req.file.fieldname !== 'cover_img') {
        throw new Error('文章封面是必选参数')
    }
    articleModel.create({
        ...req.body,
        cover_img: path.resolve(__dirname, `../uploads/article/${req.file.filename}`),
        pub_date: new Date(),
        author_id: req.auth._id
    }).then(value => {
        console.log(value)
        res.cc('添加文章成功', value)
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '4001')
    })
})

module.exports = router