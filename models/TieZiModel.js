/*
能操作users集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

// 2.字义Schema(描述文档结构)
const tieziSchema = new mongoose.Schema({
  id: {type: String, required: true}, // 贴子id
  belong_to: {type: String, required: true}, // 所属贴吧
  belong_toPerson: {type: String, required: true},// 发帖人
  belong_toPerson_MD5: {type: String, required: true},// 发帖人
  title: {type: String, required: true},//标题
  content: {type: String, required: true},//内容
  picture: Array,//一楼配图
  commit: Array,//评论
  c_commit: Array,//楼中楼

  create_time: {type: Number, default: Date.now},
  //role_id: Number     //3为超级管理员，1为普通用户,2为会员用户
});

// 3. 定义Model(与集合对应, 可以操作集合)
const TieZiModel = mongoose.model('tiezis', tieziSchema);

// 初始化默认超级管理员用户: admin/admin
TieZiModel.findOne({belong_toPerson: 'liuhao'}).then(tiezi => {
  if(!tiezi) {
    TieZiModel.create({
      id: md5('liuhao' + Date.now()),
      belong_to: "前端",
      belong_toPerson: "liuhao",
      belong_toPerson_MD5: md5("liuhao"),
      title: "ceshi",
      content: "ceshicontent"
    })
            .then(tiezi => {
             // console.log('初始化超级管理用户: 用户名: liuhao 密码为: liuhao');
            })
  }
})

// 4. 向外暴露Model
module.exports = TieZiModel;
