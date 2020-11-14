/*
能操作users集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const qunSchema = new mongoose.Schema({
    belong_to: {type: String, required: true},//创建人
    qunName: {type: String, required: true},//名
    qun_portrait: String,//头像
    teams: Array,
    create_time: {type: Number, default: Date.now},
});

// 3. 定义Model(与集合对应, 可以操作集合)
const QunModel = mongoose.model('quns', qunSchema);


// 4. 向外暴露Model
module.exports = QunModel;
