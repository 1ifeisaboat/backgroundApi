const { default: mongoose } = require("mongoose");
const { DBHOST, DBNAME, DBPORT } = require('../config/config')
const userModel = require('../model/userModel')
/**
 * 
 * @param {*} success 
 * @param {*} error 
 */
module.exports = function (success, error) {
    if (typeof error !== 'function') {
        error = () => {
            console.log('数据库连接失败')
        }
    }
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)
    mongoose.connection.once('open', () => {
        console.log('数据库连接成功')
        success()
    })
    mongoose.connection.on('close', () => {
        console.log('数据库关闭成功')
    })
    mongoose.connection.on('error', () => {
        error()
    })
}
