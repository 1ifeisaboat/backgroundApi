const { default: mongoose } = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        defalut: ''
    },
    cover_img: String,
    pub_date: Date,
    state: {
        type: String,
        required: true,
        enum: ['已发布', '草稿']
    },
    is_del: {
        type: Boolean,
        default: false
    },
    cate_id: {
        type: Number,
        required: true,
        min: 1
    },
    author_id: String
})

const articleModel = mongoose.model('articles', articleSchema)

module.exports = articleModel