// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const chatListSchema = new mongoose.Schema({
    id: {type: String, required: true},//双方用户名转md5 按第一位大小 相连 在md5一次
    user1: {type: String, required: true},
    user2: {type: String, required: true},
    list: Array,

});
// ChatListModel.find({id: 'liuhao'}).then(user => {
//   if(!user) {
//     UserModel.create({username: 'liuhao', password: md5('liuhao'),role_id:3})
//             .then(user => {
//               console.log('初始化超级管理用户: 用户名: liuhao 密码为: liuhao');
//             })
//   }
// })
// 3. 定义Model(与集合对应, 可以操作集合)
const ChatListModel = mongoose.model('chatlists', chatListSchema);


// 4. 向外暴露Model
module.exports = ChatListModel;
