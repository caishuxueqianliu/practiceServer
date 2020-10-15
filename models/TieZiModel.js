/*
能操作users集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const tieziSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  belong_to: {type: String, required: true}, // 
  // phone: String,
  title:String,
  content:String,
  commit:Object,

  create_time: {type: Number, default: Date.now},
  //role_id: Number     //3为超级管理员，1为普通用户,2为会员用户
})

// 3. 定义Model(与集合对应, 可以操作集合)
const TieZiModel = mongoose.model('tiezis', tieziSchema)

// 初始化默认超级管理员用户: admin/admin
TieZiModel.findOne({username: 'liuhao'}).then(tiezi => {
  if(!tiezi) {
    TieZiModel.create({username: 'liuhao', belong_to: "前端",titie:"ceshi",content:"ceshicontent",commit:{"ceshi":"ssss","ceshi":"xxxx"}})
            .then(tiezi => {
             // console.log('初始化超级管理用户: 用户名: liuhao 密码为: liuhao');
            })
  }
})

// 4. 向外暴露Model
module.exports = TieZiModel