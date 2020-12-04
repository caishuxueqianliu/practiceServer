var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const md5 = require('blueimp-md5');
var formidable = require('../node_modules/formidable');
const TieZiModel = require('../models/TieZiModel');
const BaModel = require('../models/BaModel');
const CommitModel = require('../models/CommitModel');
var jwts = require('../utill/token.js');



//获取指定贴所有评论
router.post('/getTieCommmit', (req, res) => {
    const {oid,page}=req.body;

    CommitModel.find({oid,page}).then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })
});



//发帖
router.post("/publishCommmit", (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.uploadDir = "./commitPicture";
    form.on('field', (field, value) => {
       
    });
    form.on('file', (name, file) => {
      
    });
    form.on('end', () => {
        res.end('upload complete');
    })
    form.parse(req,async (err, fields, files) => {
            const { username,commit,oid } = fields;
              const data =  await  CommitModel.find({oid})
              const dl =data.length+1
              const nums = 5
              const  page =Math.ceil(dl/nums)
                new CommitModel({
                            username,
                            usernameId:md5(username),
                            commit, 
                            oid, 
                            follow:0, 
                            picture:0,
                            page
                        }).save().then(datas => {
                        console.log(files)
                        
                                let dirname = path.join(__dirname, "../");
                      
                                  fs.mkdir(dirname+'commitPicture/'+datas._id, function(err){
                                         if(err){
                                          console.log(err);
                                         }else{
                                          console.log("creat done!");
                                  
                              if(files.picture3){
                                    let extname3 = path.extname(files.picture3.name);
                                    let oldpath3 = dirname + files.picture3.path;
                                    let newpath3 = dirname + 'commitPicture/' +datas._id + '/picture3' + ".jpg";
                                    fs.rename(oldpath3, newpath3, () => {
                              
                                    });
                                    let extname2 = path.extname(files.picture2.name);
                                    let oldpath2 = dirname + files.picture2.path;
                                    let newpath2 = dirname + 'commitPicture/' +datas._id + '/picture2' + ".jpg"
                                    fs.rename(oldpath2, newpath2, () => {
                              
                                    })
                                    
                                    let extname1 = path.extname(files.picture1.name);
                                    let oldpath1 = dirname + files.picture1.path;
                                    let newpath1 = dirname + 'commitPicture/' +datas._id + '/picture1' + ".jpg";
                                    fs.rename(oldpath1, newpath1, () => {
                              
                                    })
                                         CommitModel.updateOne(
                                {_id:datas._id}, //条件
                                {picture:3},
                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                })   
                                     }
                                     else if (files.picture2)
                                     {
                                    let extname2 = path.extname(files.picture2.name);
                                    let oldpath2 = dirname + files.picture2.path;
                                    let newpath2 = dirname + 'commitPicture/' +datas._id + '/picture2' + ".jpg"
                                    fs.rename(oldpath2, newpath2, () => {
                              
                                    });
                                    let extname1 = path.extname(files.picture1.name);
                                    let oldpath1 = dirname + files.picture1.path;
                                    let newpath1 = dirname + 'commitPicture/' +datas._id + '/picture1' + ".jpg";
                                    fs.rename(oldpath1, newpath1, () => {
                              
                                    });
                                      CommitModel.updateOne(
                                {_id:datas._id}, //条件
                                {picture:2},
                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                }) 
                                     }else if(files.picture1){
                                    let extname1 = path.extname(files.picture1.name);
                                    let oldpath1 = dirname + files.picture1.path;
                                    let newpath1 = dirname + 'commitPicture/' +datas._id + '/picture1' + ".jpg";
                                    fs.rename(oldpath1, newpath1, () => {
                              
                                    });
                             CommitModel.updateOne(
                                {_id:datas._id}, //条件
                                {picture:1},
                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                })
                                     }
                                     else{
                               CommitModel.updateOne(
                                {_id:datas._id}, //条件
                                {picture:0},
                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                }) 
                                     }
                                          
                                         
                                         }
                                        })
                                
                                 
                                    
                              
                            // res.send({code: 0, msg: '帖子发布成功', data: datas})
                        });
                      


    
})

});




module.exports = router;