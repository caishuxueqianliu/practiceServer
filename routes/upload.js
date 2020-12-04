var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('../node_modules/formidable');
var multiparty = require('multiparty');
var jwts = require('../utill/token.js');
const md5 = require('blueimp-md5');
//upload//头像
router.post('/icon', (req, res) => {
  
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    //const {userInfo} = req.cookies;
    //const assessToken = JSON.parse(userInfo).token;
    //  console.log(req)
    // const {username}=req.username
    let form = new formidable.IncomingForm();
    form.uploadDir = "./icon";
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
//         //重命名
   
//         // console.log(obj.length)
        const {username} = fields;
            //  console.log(username)
        let extname = path.extname(files.file.name);
      
        let dirname = path.join(__dirname, "../");

        let oldpath = dirname + files.file.path;
        console.log(oldpath)
        let newpath = dirname + 'icon/' + md5(username) + ".jpg";
        console.log(newpath)
        fs.rename(oldpath, newpath, () => {
          
           // console.log(oldpath,newpath)
        });

        // UserModel.findOne({username:username})
//         jwts.verifyToken(assessToken, (xx => {
// // console.log(username)
//             const usernameObj = xx.datas;
//             UserModel.updateOne(
//                 usernameObj, //条件
//                 {icon: md5(username)},
//                 (err, docs) => {
//                     if (err) {
//                         return console.log('更新数据失败');
//                     }
//                     // console.log(docs);
//                     //res.send({code:0,msg:"头像修改成功"})
//                 }
//             )
//         }))


    });

    // res.send({code:0,msg:"头像修改成功"})
  //  res.send('2')
})
//upload//帖子图片
router.post('/tiePicture', (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    const {userInfo} = req.cookies;
    const assessToken = JSON.parse(userInfo).token;
    // const {picId}=req.body;

    // const {username}=req.username
    let form = new formidable.IncomingForm();
    form.uploadDir = "./tiePicture";
    form.on('field', (field, value) => {
        // console.log(field);
        // console.log(value);
    });
    form.on('file', (name, file) => {
        // console.log(name);
        // console.log(file);
    });
    form.on('end', () => {
        res.end('upload complete');
    });
    var pictureArr = [];
    var picId;
    form.parse(req, (err, fields, files) => {

        picId = fields.picId;

        let extname = path.extname(files.file.name);

        let dirname = path.join(__dirname, "../");
        let oldpath = dirname + files.file.path;

        let newpath = dirname + 'tiePicture/' + picId + ".jpg";
        pictureArr.push(picId);
        fs.rename(oldpath, newpath, () => {
            // console.log(oldpath)
            // console.log(newpath)
        });


        jwts.verifyToken(assessToken, (xx => {
            // console.log(pictureArr)
            TieZiModel.updateOne(
                {id: picId}, //条件
                {picture: pictureArr},
                (err, docs) => {
                    if (err) {
                        return console.log('更新数据失败');
                    }
                    console.log("ok");
                    //res.send({code:0,msg:"头像修改成功"})
                }
            )
        }))

    });


    res.send('2')
})
//upload 吧头像
router.post('/baIcon', (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    // const {baName} = req.body;
    // const {userInfo} = req.cookies;
    // const assessToken = JSON.parse(userInfo).token;

    // const {username}=req.username
    let form = new formidable.IncomingForm();
    form.uploadDir = "./baIcon";
    form.on('field', (field, value) => {
        // console.log(field);
        // console.log(value);
    });
    form.on('file', (name, file) => {
        // console.log(name);
        // console.log(file);
    });
    form.on('end', () => {
        res.end('upload complete');
    })
    form.parse(req, (err, fields, files) => {
        //重命名
        // console.log(file)
        // console.log(obj.length)
        const {username} = fields;
        //      console.log(username)
        let extname = path.extname(files.file.name);
        let dirname = path.join(__dirname, "../");
        let oldpath = dirname + files.file.path;
        // console.log(oldpath)
        let newpath = dirname + 'baIcon/' + md5(baName) + ".jpg";
        // console.log(newpath)
        fs.rename(oldpath, newpath, () => {
            // console.log(112)
        });

        // UserModel.findOne({username:username})
//         jwts.verifyToken(assessToken, (xx => {
// // console.log(username)
//             const usernameObj = xx.datas;
//             // BaModel.updateOne(
//             //     usernameObj, //条件
//             //     {icon: md5(username)},
//             //     (err, docs) => {
//             //         if (err) {
//             //             return console.log('更新数据失败');
//             //         }
//             //         // console.log(docs);
//             //         //res.send({code:0,msg:"头像修改成功"})
//             //     }
//             // )
//         }))


    });

    // res.send({code:0,msg:"头像修改成功"})
  //  res.send('2')
})

module.exports = router;
