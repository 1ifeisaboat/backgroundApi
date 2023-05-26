const { default: mongoose } = require("mongoose");

const cateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    alias: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+$/
    },
    is_del: {
        type: Boolean,
        default: false
    }
})

const cateModel = mongoose.model('cates', cateSchema)

module.exports = cateModel