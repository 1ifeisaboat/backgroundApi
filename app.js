const express = require('express')
const cors = require('cors')
const db = require('./db/db')
const authRouter = require('./routes/auth')
const { expressjwt } = require('express-jwt')
const { secret } = require('./config/config')
const userRouter = require('./routes/user')
const cateRouter = require('./routes/cate')
const articleRouter = require('./routes/article')
const path = require('path')

db(() => {
    const app = express()


    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cors())
    app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))
    app.use((req, res, next) => {
        res.cc = (msg, data, code = '0000') => {
            res.json({
                code,
                msg,
                data
            })
        }
        next()
    })
    app.use(expressjwt({
        secret, algorithms: ['HS256']
    }).unless({ path: /^\/api\// }))

    app.use('/api', authRouter)
    app.use('/my', userRouter)
    app.use('/my/article', cateRouter)
    app.use('/my/article', articleRouter)

    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            return res.cc(err.message, null, '0001')
        }
        res.cc(err.message, null, '0002')
    })
    app.listen(3007, () => {
        console.log('http://127.0.0.1:3007')
    })
})


