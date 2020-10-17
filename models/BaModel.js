/*
能操作users集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const baSchema = new mongoose.Schema({
    belong_to: {type: String, required: true},//创建人
    baName: {type: String, required: true},//吧名
    ba_portrait: String,//吧头像
    tiezi: Array,//拥有的帖子id
    follow: Array,//关注人
    create_time: {type: Number, default: Date.now},
});

// 3. 定义Model(与集合对应, 可以操作集合)
const BaModel = mongoose.model('bas', baSchema);

// 初始化默认超级管理员用户: admin/admin
BaModel.findOne({baName: '前端'}).then(ba => {

    if (!ba) {

        BaModel.create({baName: '前端', belong_to: 'liuhao'})
            .then(ba => {
                console.log('初始化吧: 吧名: 前端 吧主为: liuhao');
            })
    }

});

// 4. 向外暴露Model
module.exports = BaModel;