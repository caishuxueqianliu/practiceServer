var express = require('express');
var router = express.Router();
const UserModel = require('../models/UserModel')
const md5 = require('blueimp-md5')
var session = require('express-session')
var svgCaptcha = require('svg-captcha');
//var jwt = require('jsonwebtoken');
var jwts = require('../utill/token.js');

router.use(session({
  resave: true,  // 新增
  secret: 'itcast',
  resave: false,
  saveUninitialized: true,// 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  cookie: { maxAge: 60000 } 
}))

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });




//登陆
router.post('/login',(req,res,next)=>{

//const {username,password,captcha}=req.body;
 const {username,password}=req.body;
 var token=jwts.generateToken({username})

 //  if(captcha!==req.session.captcha) {
 //    return res.send({code: 1, msg: '验证码不正确'})
 //  }
 //   // 删除保存的验证码
 // delete req.session.captcha
 UserModel.findOne({username}, function (err, user) {
    if (user) {
       role_id=user.role_id;
       create_time=user.create_time;
      if (user.password!== password) {
        console.log(user.password);
       return res.send({code: 1, msg: '密码不正确!'});
      } else {
        
  


    UserModel.updateOne(
    {username: username},            //匹配的内容
    {token:token},     //要更新的内容
    /*回调函数*/
    (err, docs)=>{
        if(err){return res.send({code:1,msg:"token更新失败"})}
        res.send({code: 0, data: { username: username,role_id:role_id,create_time:create_time,token:token}});
    }
)





       
      }
    }
    else{
      return     res.send({code: 1, msg: '用户名不正确!'});
    }
})



})






//注册
router.post('/register',(req,res,next)=>{

const {username,password,captcha}=req.body;
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
    
    new UserModel(
      { 
        username:req.body.username,
        password:req.body.password,
        role_id:0
    }).save(function (err, user) {
        const data = {username: username}
        res.send({code: 0, msg:'注册成功',data})
      })
    }



})

})

//修改密码

router.post('/updatepwd',(req,res,next)=>{

const {newpassword}=req.body;
const{token}= req.headers;

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
