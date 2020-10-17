var express = require('express');
var router = express.Router();
const UserModel = require('../models/UserModel');
const BaModel = require('../models/BaModel');
const TieZiModel = require('../models/TieZiModel');

const md5 = require('blueimp-md5');
var session = require('express-session');
var svgCaptcha = require('svg-captcha');
//var jwt = require('jsonwebtoken');
var jwts = require('../utill/token.js');


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
res.cookie('username','zhangsan'); 

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
                            //res.send({code: 0, data: { username: username,role_id:role_id,create_time:create_time,token:token}});

                        }
)

                }
                res.send({code: 0, data: user});
            } else{
                return     res.send({code: 1, msg: '用户名不正确!'});
            }
})

    }

})

//注册
router.post('/register',(req,res,next)=>{
console.log(new Date().toLocaleString())

const {username,password,captcha}=req.body.values;
  if(captcha!==req.session.captcha) {
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
        res.send({code: 1, msg: "查询失败", data: data})
    })


});
//创建贴吧
router.post('/est_ba', (req, res) => {
    const {accesstoken} = req.headers;

    const {baName} = req.body;

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
                        new BaModel({baName: baName, belong_to}).save().then(data => {
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
    jwts.verifyToken(accesstoken, (res => {
        const {username} = res.datas;
        belong_toPerson = username;
    }));

    UserModel.findOne({username: belong_toPerson}, function (err, user) {

        if (user) {

            BaModel.findOne({baName: belong_to}).then(ba => {
                if (ba) {
                    new TieZiModel({
                        id: md5(belong_toPerson + Date.now()),
                        belong_to, belong_toPerson, title, content
                    }).save().then(res => {
                        res.send({code: 0, msg: '帖子发布成功', data: res})
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
});


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
 
 const {token}=req.body

UserModel.findOne({token:token}, function (err, user) {

if(user){

 return res.send({code: 1, msg: {username:user.username,role_id:user.role_id}})

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
