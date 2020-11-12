var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const UserModel = require('../models/userModel');
const BaModel = require('../models/baModel');
const TieZiModel = require('../models/tieziModel');
const CommitModel = require('../models/commitModel');
const ChatListModel = require('../models/ChatListModel');
const ChatModel = require('../models/chatModel');
const md5 = require('blueimp-md5');
var session = require('express-session');
var svgCaptcha = require('svg-captcha');
//var jwt = require('jsonwebtoken');
var jwts = require('../utill/token.js');
var formidable = require('../node_modules/formidable');
router.use("/public/", express.static(path.join(__dirname, './public/')))
router.use("/node_modules/", express.static(path.join(__dirname, './node_modules/')))


const cookieParser = require("cookie-parser");
router.use(cookieParser());


router.use(session({
    // resave: true,  // 新增
    secret: 'itcast',
    resave: false,
    saveUninitialized: true,// 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
    cookie: {maxAge: 60000}
}));

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// HTTP/1.1 200 OK
// Date: Mon, 01 Dec 2008 01:15:39 GMT
// Server: Apache/2.0.61 (Unix)
// Access-Control-Allow-Origin: http://manage.leyou.com
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Methods: GET, POST, PUT
// Access-Control-Allow-Headers: X-Custom-Header
// Access-Control-Max-Age: 1728000
// Content-Type: text/html; charset=utf-8
// Content-Encoding: gzip
// Content-Length: 0
// Keep-Alive: timeout=2, max=100
// Connection: Keep-Alive
// Content-Type: text/plain
router.post('/ceshi',(req,res,next)=>{
   res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Methods", "GET, POST");
 console.log(req.cookie)
res.send({msg:'postok'})

})
router.get('/ceshi',(req,res)=>{
 // res.cookie("userName",'张2',{maxAge: 20000, httpOnly: true});
res.cookie('username', 'zhangsan');

 //   res.setHeader("Access-Control-Allow-Origin", "*");
 // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
res.send({msg:'getok'})

});
//登陆
router.post('/login',(req,res,next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
//const {username,password,captcha}=req.body;
// console.log(new Date().toLocaleString())
    const {accesstoken} = req.headers;
    var {username, password} = req.body.values;
    password = md5(password);
    var token = jwts.generateToken({username});
// console.log(username)
    //  if(captcha!==req.session.captcha) {
    //    return res.send({code: 1, msg: '验证码不正确'})
    //  }
    //   // 删除保存的验证码
    // delete req.session.captcha

    if (accesstoken) {
        console.log(accesstoken)
        UserModel.findOne({username}, function (err, user) {
            res.send({code: 0, data: user});
        })
    } else {
        UserModel.findOne({username}, function (err, user) {
            //console.log(user)
            if (user) {
                role_id = user.role_id;
                create_time = user.create_time;
                if (user.password !== password) {
                    //console.log(user.password);
                    return res.send({code: 1, msg: '密码不正确!'});
                } else {

                    UserModel.updateOne(
                        {username: username},            //匹配的内容
                        {token:token},     //要更新的内容
                        /*回调函数*/
                        (err, docs)=> {
                            if (err) {
                                return res.send({code: 1, msg: "token更新失败"})
                            }
                         else{
                                UserModel.findOne({username}, function (err, user) {
                                    res.send({code: 0, msg: 'login success!',data: user});
                                })
                            }
                            //res.send({code: 0, data: { username: username,role_id:role_id,create_time:create_time,token:token}});

                        }
)

                }

            } else {
                return res.send({code: 1, msg: '用户名不正确!'});
            }
        })

    }

});
//获取所以用户
router.get("/getUser", (req, res) => {
    UserModel.find().then(data => {
        res.send(data)
    })

});
//注册
router.post('/register', (req, res, next) => {
    console.log(new Date().toLocaleString())

    const {username, password, captcha} = req.body.values;
    if (captcha !== req.session.captcha) {
        return res.send({code: 1, msg: '验证码不正确'})
    }
  // 删除保存的验证码
 delete req.session.captcha
UserModel.findOne({username}, function (err, user) {

if(user){
 res.send({code: 1, msg: '用户名已存在'})

}
else {

    // new UserModel(
    //   {
    //     username:req.body.username,
    //     password:req.body.password,
    //     role_id:0
    // },false).save(function (err, user) {

    //     const data = {username: username}
    //     res.send({code: 0, msg:'注册成功',data})
    //   })
   // console.log(username,password)
   new UserModel(
       {
           username: username,
           password: md5(password),
           role_id: 0
       }, false).save().then(() => {
       const data = {username: username}
       res.send({code: 0, msg: '注册成功', data})
   }).catch(err => {
       console.log(err)
   })
}


})

});

//获取所有贴吧
router.get('/getBas', (req, res) => {
    BaModel.find().then(data => {
        res.send({code: 0, msg: "查询成功", data: data})
    }).catch(err => {
        console.log(err);
        res.send({code: 1, msg: "查询失败"})
    })


});

//获取指定吧所有帖子
router.post('/getBaTie', (req, res) => {
   // console.log(req.body)
    const {baName}=req.body;
console.log(baName)

    TieZiModel.find({belong_to: baName}).then(data => {
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


//创建贴吧
router.post('/est_ba', (req, res) => {
    const {accesstoken} = req.headers;

    const {baName, ba_portrait} = req.body;

    var belong_to;
    // console.log(accesstoken)
    jwts.verifyToken(accesstoken, (datax => {

        // console.log(datax)
        const {username} = datax.datas;
        // console.log(username)
        belong_to = username;

        UserModel.findOne({username: belong_to}, function (err, user) {

            if (user) {
                //res.send({code: 1, msg: '用户名已存在'})
                BaModel.findOne({baName: baName}, (err, ba) => {
                    if (ba) {
                        res.send({code: 1, msg: baName + '吧已经存在'})
                    } else {
                        new BaModel({baName: baName, belong_to, ba_portrait: md5(baName)}).save().then(data => {
                            // res.send({code: 0, msg: baName+'吧创建成功',belong_to:belong_to})
                            res.send({code: 0, msg: "创建成功", data: data})
                        }).catch(err => {
                            console.log(err);
                            res.send({code: 1, msg: "创建失败"})
                        })

                    }
                })


            } else {
                res.send({code: 1, msg: 'token无效'})
            }
        })

    }));


    // console.log(mingwen)
    //console.log(accesstoken,baName)
    //res.send({code:0,data:{msg:"贴吧创建完成",baName:baName,belong_to:belong_to}})
});


//发帖
router.post("/publish", (req, res) => {
    const {belong_to, title, content, picture} = req.body;
    const {accesstoken} = req.headers;
    var belong_toPerson;
    console.log(accesstoken)
    console.log(req.body)
    jwts.verifyToken(accesstoken, (data => {

        const {username} = data.datas;
        belong_toPerson = username;

       // console.log("username"+username)
        UserModel.findOne({username: belong_toPerson}, function (err, user) {

            if (user) {

                BaModel.findOne({baName: belong_to}).then(ba => {
                    if (ba) {
                        new TieZiModel({
                            id: md5(belong_toPerson + Date.now()),
                            belong_toPerson_MD5: md5(belong_toPerson),
                            belong_to, belong_toPerson, title, content
                        }).save().then(datas => {
                            BaModel.updateOne(
                                {baName: belong_to}, //条件
                                {$set: {tiezi: datas.title, lastupdate: new Date().toLocaleString()}},


                                (err, docs) => {
                                    if (err) {
                                        return console.log('更新数据失败');
                                    }
                                    console.log(docs);
                                })
                            res.send({code: 0, msg: '帖子发布成功', data: datas})
                        });
                    } else {
                        res.send({code: 1, msg: '此贴吧名不存在'})
                    }

                }).catch(err => {
                    console.log(err);
                    res.send({code: 1, msg: '数据库查找吧名失败'})
                })


            } else {
                res.send({code: 1, msg: 'token无效'})
            }

        })
    }));


});

//帖子详情
router.post('/getTieContent', (req, res) => {

    const {tieId} = req.body;
 console.log(tieId)
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

//评论
router.post("/commit", (req, res) => {
    const {oid, username, content, picture} = req.body;
    const {accesstoken} = req.headers;
    var belong_toPerson;
    // console.log(accesstoken)
    // console.log(req.body)
    jwts.verifyToken(accesstoken, (data => {

        const {username} = data.datas;
        belong_toPerson = username;

        // console.log("username"+username)
        new CommitModel({
            username: username, // 用户名
            commit: content,
            picture: picture,
            usernameId: md5(username),
            id: md5(username + Date.now()),
            oid: oid
        }).save().then(xx => {
            // console.log(oid)
            TieZiModel.findOne({id: oid}).then(data => {
                console.log(data)
                var commit = data.commit;
                commit.push(xx);
                TieZiModel.updateOne(
                    {id: oid}, //条件
                    {commit: commit},     //要更新的内容

                    (err, docs) => {
                        if (err) {
                       return console.log('更新数据失败');
                   }
                       res.send({code: 0, msg: "commit success"})
               }
           )

           })



       })

        // } else {
        //     res.send({code: 1, msg: 'token无效'})
        // }


    }));


});

//upload//头像
router.post('/icon', (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    const {userInfo} = req.cookies;
    const assessToken = JSON.parse(userInfo).token;

    // const {username}=req.username
    let form = new formidable.IncomingForm();
    form.uploadDir = "./icon";
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
        let newpath = dirname + 'icon/' + md5(username) + ".jpg";
        // console.log(newpath)
        fs.rename(oldpath, newpath, () => {
            // console.log(112)
        });

        // UserModel.findOne({username:username})
        jwts.verifyToken(assessToken, (xx => {
// console.log(username)
            const usernameObj = xx.datas;
            UserModel.updateOne(
                usernameObj, //条件
                {icon: md5(username)},
                (err, docs) => {
                    if (err) {
                        return console.log('更新数据失败');
                    }
                    // console.log(docs);
                    //res.send({code:0,msg:"头像修改成功"})
                }
            )
        }))


    });

    // res.send({code:0,msg:"头像修改成功"})
    res.send('2')
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

//upload个签
router.post('/sign', (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    const {accesstoken} = req.headers;
    const {signValue} = req.body;

    jwts.verifyToken(accesstoken, (xx => {
        const usernameObj = xx.datas;
        UserModel.updateOne(
            usernameObj, //条件
            {sign: signValue},
            (err, docs) => {
                if (err) {
                    return console.log('更新数据失败');
                }
                // console.log(docs);
                res.send({code: 0, msg: "修改成功"})
            }
        )
    }))


});

//upload 吧头像
router.post('/baIcon', (req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    const {baName} = req.body;
    const {userInfo} = req.cookies;
    const assessToken = JSON.parse(userInfo).token;

    // const {username}=req.username
    let form = new formidable.IncomingForm();
    form.uploadDir = "./icon";
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
        jwts.verifyToken(assessToken, (xx => {
// console.log(username)
            const usernameObj = xx.datas;
            // BaModel.updateOne(
            //     usernameObj, //条件
            //     {icon: md5(username)},
            //     (err, docs) => {
            //         if (err) {
            //             return console.log('更新数据失败');
            //         }
            //         // console.log(docs);
            //         //res.send({code:0,msg:"头像修改成功"})
            //     }
            // )
        }))


    });

    // res.send({code:0,msg:"头像修改成功"})
    res.send('2')
})


//聊天相关

//一对一聊天，点开聊天窗口时创建
router.post("/addDoubleChat", ((req, res) => {
    console.log(req.body)
    let {user1, user2} = req.body;
    user1 = md5(user1);
    user2 = md5(user2);
    var listId;
    if (user1 > user2) {
        listId = user1 + user2;
    } else {
        listId = user2 + user1;
    }


// console.log(listId)
    ChatListModel.findOne({id: listId}).then(chatlist => {
        //console.log(res)
        if (!chatlist) {
            new ChatListModel({
                id: listId,
                user1: user1,
                user2: user2
            }).save().then(data => {
                res.send({data: data});
            })

        } else if (chatlist) {
            res.send({data: chatlist});
        }

    });


}));


//uoload
// router.post('/image',(req,res)=>{
//     // res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Methods", "GET, POST");
//     // console.log(req)
//     let form = new formidable.IncomingForm();
//     form.uploadDir = "./uploads";
//     form.on('field',(field,value)=>{
//         // console.log(field);
//         // console.log(value);
//     });
//     form.on('file',(name,file)=>{
//         // console.log(name);
//         // console.log(file);
//     });
//     form.on('end',()=>{
//         res.end('upload complete');
//     })
//     form.parse(req,(err,fields,files)=>{
//         //重命名
//        console.log(files)
//         var obj=[]
//         for (var i in files ){
//             obj.push(files[i])
//
//         }
//        // console.log(obj.length)
//         for (var i = 1; i <= obj.length+1; i++) {
//
//
//             let extname = path.extname(files.file.name);
//             let dirname=path.join(__dirname,"../");
//             let oldpath=dirname+files.file.path
//            // console.log(oldpath)
//             let newpath = dirname + 'uploads/' +i+ extname;
//            // console.log(newpath)
//             fs.rename(oldpath, newpath,()=>{
//                // console.log(112)
//             });
//         }
//
//
// //let ran =parseInt((Math.random()*10+1))
//
//         // let extname = path.extname(files.file.name);
//         // let oldpath=__dirname+'/'+files.file.path
//         // let newpath = __dirname + '/uploads/' +ran+ extname;
//         // fs.rename(oldpath, newpath,function(err){
//         //     if(err){
//         //         throw Error("改名失败");
//         //     }
//         // });
//
//
//
// //         var keys = Object.keys(obj);
// // console.log('长度', keys.length);
// // keys.forEach(function(key, index) {
// //   console.log('当前是第', index + 1, '个, key是', key, ', value是', obj[key]);
// // });
//
//
//
//
//
//
//
//
//
//     });
//
//
//     res.send('2')
// })


//修改密码

router.post('/updatepwd', (req, res, next) => {
    console.log(new Date().toLocaleString())

    const {newpassword} = req.body;
    const {token} = req.headers;

    UserModel.updateOne(
    {token: token},            //匹配的内容
    {password: newpassword},     //要更新的内容
    /*回调函数*/
    (err, docs)=>{
        if(err){return res.send({code:1,msg:"密码修改失败"})}
        res.send({code:0,msg:"密码修改成功"})
    }
)
})
//管理员修改role_id权限
router.post('/updaterole_id',(req,res,next)=>{

const {username,role}=req.body;
const{token}= req.headers;
UserModel.findOne({token:token},(err,user)=>{
if(user){
  if(user.role_id==3){
//更新权限
if(role==2){
UserModel.updateOne(
    {username: username},            //匹配的内容
    {role_id:2},     //要更新的内容
    /*回调函数*/
    (err, docs)=>{
        if(err){return res.send({code:1,msg:"二级权限修改失败"})}
        res.send({code:0,msg:"二级权限修改成功"})
    }
)

}
else if(role==1){
UserModel.updateOne(
    {username: username},            //匹配的内容
    {role_id:1},     //要更新的内容
    /*回调函数*/
    (err, docs)=>{
        if(err){return res.send({code:1,msg:"一级权限修改失败"})}
        res.send({code:0,msg:"一级权限修改成功"})
    }
)

}
//更新权限

  }
  else {
    res.send({code:0,msg:"权限不足"})
  }



}
else{
res.send({code:1,msg:"token验证失败"})
}
})






})




//验证码
router.get('/captcha', function (req,res,next) {
  var captcha = svgCaptcha.create({
    ignoreChars: '0o1l',
    noise: 2,
    color: true
  });
    req.session.captcha = captcha.text.toLowerCase();
    //console.log(req.session.captcha)
    res.type('svg');
  res.send(captcha.data);
});


//token验证


router.post('/token', function (req,res,next) {

    const {token} = req.body

    UserModel.findOne({token: token}, function (err, user) {

        if (user) {

            return res.send({code: 1, msg: {username: user.username, role_id: user.role_id}})

        }
        return res.send({code: 0, msg: 'token验证失败'})

});


});


//发布内容
router.post('/publish',(req,res,next)=>{

console.log(new Date().toLocaleString())




})





//router.post('/login', function(req, res, next) {
//res.setHeader("Access-Control-Allow-Origin", "*");

// const username = req.body.username
// const password = md5(req.body.password)
// const captcha = req.body.captcha.toLowerCase()



// News.updateOne(
//     {'_id':'5cf5e613ba3c6298a8734973'}, //条件
//     {title: '这是一则新闻111'},     //要更新的内容
//     回调函数
//     (err, docs)=>{
//         if(err){return console.log('更新数据失败');}
//         console.log(docs);
//     }
// )



// News.deleteOne(
//     {'_id':'5cf5e613ba3c6298a8734973'}, //查找条件
//     /*回调函数*/
//     (err,docs)=>{
//         if(err){return console.log('删除数据失败')}
//         console.log(docs);
//     }

// )
module.exports = router;
