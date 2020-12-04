var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const BaModel = require('../models/BaModel');
const md5 = require('blueimp-md5');
var jwts = require('../utill/token.js');
var formidable = require('../node_modules/formidable');

// 获取所有贴吧
router.get('/getBas', (req, res) => {
    BaModel.find().then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })


});

// 获取用户所拥有的贴吧
router.get('/getUserBas', (req, res) => {
    const { username } = req.query
   // console.log(username)
    BaModel.find({belong_to:username}).then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })


});

// 创建贴吧
router.post('/est_ba', (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = "./baIcon";
    form.on('field', (field, value) => {
    });
    form.on('file', (name, file) => {
    
    });
    form.on('end', () => {
        res.end('upload complete');
    })
    form.parse(req, (err, fields, files) => {
  
            const { baName ,belong_to } = fields;
           
                BaModel.findOne({baName: baName}, (err, ba) => {
                    if (ba) {
                        res.send({code: 1, msg: baName + '吧已经存在'})
                    } else {
                        new BaModel({baName: baName, belong_to, ba_portrait: md5(baName)}).save().then(data => {
                                   let extname = path.extname(files.file.name);
      
                                    let dirname = path.join(__dirname, "../");
                            
                                    let oldpath = dirname + files.file.path;
                                    console.log(oldpath)
                                    let newpath = dirname + 'baIcon/' + md5(baName) + ".jpg";
                                    console.log(newpath)
                                    fs.rename(oldpath, newpath, () => {
                              
                                    });
                            res.send({code: 0, msg: "创建成功", data: data})
                        }).catch(err => {
                            console.log(err);
                            res.send({code: 1, msg: "创建失败"})
                        })

                    }
                })

    
})
})

//更换baIcon
router.post('/uploadBaIcon', (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = "./baIcon";
        //console.log(form)
    form.on('field', (field, value) => {
        console.log(field);
        console.log(value);
    });
    form.on('file', (name, file) => {
        console.log(name);
         console.log(file);
    });
    form.on('end', () => {
        res.end('upload complete');
    })
    form.parse(req, (err, fields, files) => {
        // console.log(fields)
        // console.log(files)
        
            const { baName } = fields;
            //  console.log(username)
        let extname = path.extname(files.file.name);
      
        let dirname = path.join(__dirname, "../");

        let oldpath = dirname + files.file.path;
        console.log(oldpath)
        let newpath = dirname + 'baIcon/' + md5(baName) + ".jpg";
        console.log(newpath)
        fs.rename(oldpath, newpath, () => {
          
           // console.log(oldpath,newpath)
        });
    
})
})


// // 创建贴吧
// router.post('/est_ba1', (req, res) => {
//     const {accesstoken} = req.headers;

//     const {baName, ba_portrait} = req.body;

//     var belong_to;
//     // console.log(accesstoken)
//     jwts.verifyToken(accesstoken, (datax => {

//         // console.log(datax)
//         const {username} = datax.datas;
//         // console.log(username)
//         belong_to = username;

//         UserModel.findOne({username: belong_to}, function (err, user) {

//             if (user) {
//                 //res.send({code: 1, msg: '用户名已存在'})
//                 BaModel.findOne({baName: baName}, (err, ba) => {
//                     if (ba) {
//                         res.send({code: 1, msg: baName + '吧已经存在'})
//                     } else {
//                         new BaModel({baName: baName, belong_to, ba_portrait: md5(baName)}).save().then(data => {
//                             // res.send({code: 0, msg: baName+'吧创建成功',belong_to:belong_to})
//                             res.send({code: 0, msg: "创建成功", data: data})
//                         }).catch(err => {
//                             console.log(err);
//                             res.send({code: 1, msg: "创建失败"})
//                         })

//                     }
//                 })


//             } else {
//                 res.send({code: 1, msg: 'token无效'})
//             }
//         })

//     }));


//     // console.log(mingwen)
//     //console.log(accesstoken,baName)
//     //res.send({code:0,data:{msg:"贴吧创建完成",baName:baName,belong_to:belong_to}})
// });

module.exports = router;