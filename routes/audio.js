var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const AudioModel = require('../models/AudioModel');
var formidable = require('../node_modules/formidable');
// var jwts = require('../utill/token.js');



//获取所有音频
router.get("/getAllAudio",(req,res,next)=>{
    
    AudioModel.find().then(data=>{
        res.send({code:0,msg:"获取所有音频成功",data:data})
    }).catch((err)=>{
          res.send({code:1,msg:"获取失败"})
    })
    
    
})

//上传audio
router.post("/uploadAudio",(req,res,next)=>{
    let form = new formidable.IncomingForm();
    form.uploadDir = "./audio";
    form.on('field', (field, value) => {
       
    });
    form.on('file', (name, file) => {
      
    });
    form.on('end', () => {
        res.end('upload complete');
    })
    form.parse(req,async (err, fields, files) => {
        
        const {belong_to,name} =fields
        new AudioModel({belong_to,name}).save().then((data)=>{
             let extname = path.extname(files.audio.name);
              let dirname = path.join(__dirname, "../");
             let oldpath = dirname + files.audio.path;
             let newpath = dirname + 'audio/'+files.audio.name 
               fs.rename(oldpath, newpath, () => {
                              
                  });
            
        })
      
            
        
    })
    
})


// router.get('/aduio/1.f25a5add.mp3', function(req, res){
//   ms.pipe(req, res, "../aduio/1.f25a5add.mp3");
// });
module.exports = router;