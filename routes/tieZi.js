var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const md5 = require('blueimp-md5');
var formidable = require('../node_modules/formidable');
const TieZiModel = require('../models/TieZiModel');
const BaModel = require('../models/BaModel');
var jwts = require('../utill/token.js');


//获取指定吧所有帖子
router.post('/getBaTie', (req, res) => {
    // console.log(req.body)
    const {baName,page}=req.body;

    TieZiModel.find({belong_to: baName,page}).then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })
    // res.send({code: 1, msg: "查询失败"})
});
//获取指定吧所有帖子
router.post('/getBaTieId', (req, res) => {
    // console.log(req.body)
    const {_id}=req.body;

    TieZiModel.findOne({_id}).then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })
    // res.send({code: 1, msg: "查询失败"})
});
//获取用户所有帖子
router.post('/getUserTie', (req, res) => {
    const {username} = req.body
    console.log(username)
    TieZiModel.find({belong_toPerson: username}).then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })

});


//发帖
router.post("/publish", (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.uploadDir = "./tiePicture";
    form.on('field', (field, value) => {
       
    });
    form.on('file', (name, file) => {
      
    });
    form.on('end', () => {
        res.end('upload complete');
    })
    form.parse(req, async (err, fields, files) => {
    //   console.log(fields)
    //   console.log(files)
            const { belong_to,belong_toPerson,title,content } = fields;
            
              const data =  await  TieZiModel.find({belong_to})
              const dl =data.length+1
              const nums = 5
              const  page =Math.ceil(dl/nums)
                new TieZiModel({
                            id: md5(belong_toPerson + Date.now()),
                            belong_toPerson_MD5: md5(belong_toPerson),
                            belong_to, belong_toPerson, title, content,
                            page
                        }).save().then(datas => {
                            BaModel.updateOne(
                                {baName: belong_to}, //条件
                                {$set: {tiezi: datas.title, lastupdate: new Date().toLocaleString()}},
                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                  //  console.log(docs);
                                })
                             //   console.log(files)
                                let dirname = path.join(__dirname, "../");
                                  //console.log(datas._id)
                                  fs.mkdir(dirname+'tiePicture/'+datas._id, function(err){
                                         if(err){
                                          console.log(err);
                                         }else{
                                          console.log("creat done!");
                                  
                              if(files.picture3){
                                    let extname3 = path.extname(files.picture3.name);
                                    let oldpath3 = dirname + files.picture3.path;
                                    let newpath3 = dirname + 'tiePicture/' +datas._id + '/picture3' + ".jpg";
                                    fs.rename(oldpath3, newpath3, () => {
                              
                                    });
                                    let extname2 = path.extname(files.picture2.name);
                                    let oldpath2 = dirname + files.picture2.path;
                                    let newpath2 = dirname + 'tiePicture/' +datas._id + '/picture2' + ".jpg"
                                    fs.rename(oldpath2, newpath2, () => {
                              
                                    })
                                    
                                    let extname1 = path.extname(files.picture1.name);
                                    let oldpath1 = dirname + files.picture1.path;
                                    let newpath1 = dirname + 'tiePicture/' +datas._id + '/picture1' + ".jpg";
                                    fs.rename(oldpath1, newpath1, () => {
                              
                                    })
                                         TieZiModel.updateOne(
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
                                    let newpath2 = dirname + 'tiePicture/' +datas._id + '/picture2' + ".jpg"
                                    fs.rename(oldpath2, newpath2, () => {
                              
                                    });
                                    let extname1 = path.extname(files.picture1.name);
                                    let oldpath1 = dirname + files.picture1.path;
                                    let newpath1 = dirname + 'tiePicture/' +datas._id + '/picture1' + ".jpg";
                                    fs.rename(oldpath1, newpath1, () => {
                              
                                    });
                                      TieZiModel.updateOne(
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
                                    let newpath1 = dirname + 'tiePicture/' +datas._id + '/picture1' + ".jpg";
                                    fs.rename(oldpath1, newpath1, () => {
                              
                                    });
                             TieZiModel.updateOne(
                                {_id:datas._id}, //条件
                                {picture:1},
                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                })
                                     }
                                     else{
                               TieZiModel.updateOne(
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

//帖子详情
router.post('/getTieContent', (req, res) => {

    const {tieId} = req.body;
           //console.log(tieId)
        TieZiModel.find({id: tieId}, function (err, tie) {

            if (tie) {
               res.send({code: 1, msg: '查询成功',data:tie})



            } else {
                res.send({code: 1, msg: '帖子查询错误'})
            }
        })




    // console.log(mingwen)
    //console.log(accesstoken,baName)
    //res.send({code:0,data:{msg:"贴吧创建完成",baName:baName,belong_to:belong_to}})
});

// //评论
// router.post("/commit", (req, res) => {
//     const {oid, username, content, picture} = req.body;
//     const {accesstoken} = req.headers;
//     var belong_toPerson;
//     // console.log(accesstoken)
//     // console.log(req.body)
//     jwts.verifyToken(accesstoken, (data => {

//         const {username} = data.datas;
//         belong_toPerson = username;

//         // console.log("username"+username)
//         new CommitModel({
//             username: username, // 用户名
//             commit: content,
//             picture: picture,
//             usernameId: md5(username),
//             id: md5(username + Date.now()),
//             oid: oid
//         }).save().then(xx => {
//             // console.log(oid)
//             TieZiModel.findOne({id: oid}).then(data => {
//                 console.log(data)
//                 var commit = data.commit;
//                 commit.push(xx);
//                 TieZiModel.updateOne(
//                     {id: oid}, //条件
//                     {commit: commit},     //要更新的内容

//                     (err, docs) => {
//                         if (err) {
//                       return console.log('更新数据失败');
//                   }
//                       res.send({code: 0, msg: "commit success"})
//               }
//           )

//           })



//       })

//         // } else {
//         //     res.send({code: 1, msg: 'token无效'})
//         // }


//     }));


// });


// //发帖
// router.post("/publish", (req, res) => {
//     const {belong_to, title, content} = req.body;
//     const {accesstoken} = req.headers;
//     var belong_toPerson;

//     jwts.verifyToken(accesstoken, (data => {

//         const {username} = data.datas;
//         belong_toPerson = username;

//         UserModel.findOne({username: belong_toPerson}, function (err, user) {

//             if (user) {

//                 BaModel.findOne({baName: belong_to}).then(ba => {
//                     if (ba) {
//                         new TieZiModel({
//                             id: md5(belong_toPerson + Date.now()),
//                             belong_toPerson_MD5: md5(belong_toPerson),
//                             belong_to, belong_toPerson, title, content
//                         }).save().then(datas => {
//                             BaModel.updateOne(
//                                 {baName: belong_to}, //条件
//                                 {$set: {tiezi: datas.title, lastupdate: new Date().toLocaleString()}},
//                                 (err, docs) => {
//                                     if (err) {
//                                         return console.log('更新数据失败');
//                                     }
//                                     console.log(docs);
//                                 })
//                             res.send({code: 0, msg: '帖子发布成功', data: datas})
//                         });
//                     } else {
//                         res.send({code: 1, msg: '此贴吧名不存在'})
//                     }

//                 }).catch(err => {
//                     console.log(err);
//                     res.send({code: 1, msg: '数据库查找吧名失败'})
//                 })


//             } else {
//                 res.send({code: 1, msg: 'token无效'})
//             }

//         })
//     }));


// });




module.exports = router;