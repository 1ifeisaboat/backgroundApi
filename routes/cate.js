const express = require('express')
const cateModel = require('../model/cateModel')

const router = express.Router()

router.get('/cates', (req, res) => {
    cateModel.find({ is_del: false }).then(value => {
        console.log(value)
        res.cc('获取成功', value)
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '3001')
    })
})
router.post('/cates', (req, res) => {
    let addFlag = true
    cateModel.find({ is_del: true }).then(value => {
        value.forEach(item => {
            if (req.body.name === item.name && req.body.alias === item.alias) {
                addFlag = false
            }
        })
        if (addFlag) {
            return cateModel.create(req.body)
        }
        return cateModel.updateOne({ name: req.body.name }, { $set: { is_del: false } })
    }).then(value => {
        console.log(value)
        res.cc('添加成功', value)
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '3002')
    })
})
router.delete('/cates/:id', (req, res) => {
    cateModel.updateOne({ _id: req.params.id }, { $set: { is_del: true } }).then(value => {
        console.log(value)
        if (value.matchedCount === 0) {
            throw new Error('该分类不存在')
        }
        if (value.modifiedCount === 0) {
            throw new Error('该分类已删除')
        }
        res.cc(`删除成功`, {})
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '3003')
    })
})
router.patch('/cates/:id', (req, res) => {
    cateModel.findById(req.params.id)
        .then(value => {
            console.log(value)
            if (value.is_del) {
                throw new Error('分类已删除')
            }
            return cateModel.updateOne({ _id: req.params.id }, { $set: req.body })
        }).then(value => {
            console.log(value)
            if (value.matchedCount === 0) {
                throw new Error('该分类不存在')
            }
            if (value.modifiedCount === 0) {
                throw new Error('修改值不能与原值一致')
            }
            res.cc(`修改成功`, {})
        }).catch(error => {
            console.log(error)
            res.cc(error.message, null, '3004')
        })
})
router.get('/cates/:id', (req, res) => {
    cateModel.findById(req.params.id).then(value => {
        console.log(value)
        if (!value) {
            throw new Error('分类不存在')
        }
        if (value.is_del) {
            throw new Error('分类已删除')
        }
        res.cc(`获取 ${value.name} 成功`, value)
    }).catch(error => {
        console.log(error)
        res.cc(error.message, null, '3005')
    })
})
module.exports = router