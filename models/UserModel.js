/*
能操作users集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  // phone: String,
  token: String,
  create_time: {type: Number, default: Date.now},
  role_id: Number     //3为超级管理员，1为普通用户,2为会员用户
})

// 3. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('users', userSchema)

// 初始化默认超级管理员用户: admin/admin
UserModel.findOne({username: 'liuhao'}).then(user => {
  if(!user) {
    UserModel.create({username: 'liuhao', password: md5('liuhao'),role_id:3})
            .then(user => {
              console.log('初始化超级管理用户: 用户名: liuhao 密码为: liuhao');
            })
  }
})

// 4. 向外暴露Model
module.exports = UserModel