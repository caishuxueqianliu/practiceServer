var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
const UserModel = require('../models/UserModel');
const BaModel = require('../models/BaModel');
const TieZiModel = require('../models/TieZiModel');
const CommitModel = require('../models/CommitModel');
const ChatListModel = require('../models/ChatListModel');
const ChatMessageModel = require('../models/ChatMessageModel');
const ChatModel = require('../models/chatModel');
const QunModel = require('../models/QunModel');
const md5 = require('blueimp-md5');
var session = require('express-session');
var svgCaptcha = require('svg-captcha');
//var jwt = require('jsonwebtoken');
var jwts = require('../utill/token.js');

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



//登陆
router.post('/login',(req,res,next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");

    var form = new multiparty.Form({
        encoding: "utf-8",
        //  uploadDir:"public/upload",  //文件上传地址
        keepExtensions: true  //保留后缀
    })

    form.parse(req, function (err, fields, files) {
        // console.log(fields)
        // var obj ={};
        // Object.keys(fields).forEach(function(name) {  //文本
        //   //  console.log('name:' + name+";filed:"+fields[name]);
        //     obj[name] = fields[name];
        // });
        //   console.log(obj)
        // Object.keys(files).forEach(function(name) {  //文件
        //     console.log('name:' + name+";file:"+files[name]);
        //     obj[name] = files[name];
        // });
        //
        // callback(err,obj);
        const {accesstoken} = req.headers;
        //  console.log(req)
        var {username, password} = fields;
        password = md5(password);
        var token = jwts.generateToken({username});
// console.log(username)
        //  if(captcha!==req.session.captcha) {
        //    return res.send({code: 1, msg: '验证码不正确'})
        //  }
        //   // 删除保存的验证码
        // delete req.session.captcha

        if (accesstoken) {
            // console.log(accesstoken)
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
                            {token: token},     //要更新的内容
                            /*回调函数*/
                            (err, docs) => {
                                if (err) {
                                    return res.send({code: 1, msg: "token更新失败"})
                                } else {
                                    UserModel.findOne({username}, function (err, user) {
                                        res.send({code: 0, msg: 'login success!', data: user});
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
            icon: md5(username),
            sign:"觉宇宙之无穷，哀吾生之须臾",
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



//聊天相关

//一对一聊天，点开聊天窗口时创建
router.post("/addDoubleChat", ((req, res) => {
    // console.log(req.body)
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
//

//创建群组，
router.post("/addManyChat", ((req, res) => {
    // console.log(req.body)
    let {user1, qunName} = req.body;
    new QunModel({
        belong_to: user1,//创建人
        qunName: qunName,//名
        create_time: {type: Number, default: Date.now},
    }).save().then(data => {
        res.send({data: data});
    })

}));
//get 群组
router.post("/getQun1", ((req, res) => {
    // console.log(req.body)
    let {user} = req.body;
    QunModel.find({
        belong_to: user,//创建人
    }).then(data => {
        res.send(data)
    })

}));
router.post("/getQun2", ((req, res) => {
    // console.log(req.body)
    let {user} = req.body;
    QunModel.find({
        teams: user,//创建人
    }).then(data => {
        res.send(data)
    })

}));
//群组加人
router.post("/addManyChatPerson", ((req, res) => {
    // console.log(req.body)
    let {qunNameID, user2} = req.body;
    QunModel.findOne({_id: qunNameID}).then(res => {
        if (res) {
            let teamsx = res.teams
            teamsx.push(user2)
            QunModel.updateOne(
                {_id: qunNameID}, //条件
                {teams: teamsx},     //要更新的内容
                (err, docs) => {
                    if (err) {
                        return console.log('更新数据失败');
                    }
                    console.log(docs);
                }
            )
        }
        res.send("err")
    })

}));


//聊天信息获取
router.get('/chatList', (req, res) => {
    ChatMessageModel.find().then(data => {
        res.send(data)
    })

})
//聊天信息上传
router.post('/chatList', (req, res) => {
    const {msg, sendPerson, icon} = req.body
    new ChatMessageModel({
        msg, sendPerson, icon
    }).save().then(data => {
        res.send('ok')
    })
})

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
