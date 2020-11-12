// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const chatSchema = new mongoose.Schema({
    sendPerson: {type: String, required: true},//发送人
    type: {type: Number, required: true},//0 ：一对一、1 ：1对多
    id: {type: String, required: true},//0+聊天组唯一md5（id）
    send_time: {type: Number, default: Date.now},
});

// 3. 定义Model(与集合对应, 可以操作集合)
const ChatModel = mongoose.model('chats', chatSchema);


// 4. 向外暴露Model
module.exports = ChatModel;
