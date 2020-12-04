// 1.引入mongoose
const mongoose = require('mongoose');


// 2.字义Schema(描述文档结构)
const AudioSchema = new mongoose.Schema({
    belong_to: {type: String, required: true},//创建人
    name: {type: String, required: true},//歌名
    create_time: {type: Number, default: Date.now},
});

// 3. 定义Model(与集合对应, 可以操作集合)
const AudioModel = mongoose.model('audios', AudioSchema);

// 4. 向外暴露Model
module.exports = AudioModel;