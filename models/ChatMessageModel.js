// 1.引入mongoose
const mongoose = require('mongoose');
// const md5 = require('blueimp-md5')

// 2.字义Schema(描述文档结构)
const chatMessageSchema = new mongoose.Schema({
    msg: {type: String, required: true},
    sendPerson: {type: String, required: true},
    icon: {type: String, required: true},

});

// 3. 定义Model(与集合对应, 可以操作集合)
const ChatMessageModel = mongoose.model('chatMessages', chatMessageSchema);


// 4. 向外暴露Model
module.exports = ChatMessageModel;
