const express = require("express");
const expressWs = require("express-ws")
const router = express.Router()
expressWs(router);
//var cookieSession = require('cookie-session')
var session = require('express-session')


var cookieParser = require('cookie-parser')
router.use(cookieParser('liuhao'))

router.use(session({
  secret: 'liuhao',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  rolling:true 
}))
router.ws("/tt", (ws, req) => {
  ws.send("连接成功")
 let interval
 // 连接成功后使用定时器定时向客户端发送数据，同时要注意定时器执行的时机，要在连接开启状态下才可以发送数据
  interval = setInterval(() => {
  console.log(ws.readyState);
  console.log(ws.OPEN);
  
   if (ws.readyState === ws.OPEN) {
    console.log('yes');
       ws.send((new Date()).toLocaleString())

   } else {
    console.log('no');
      clearInterval(interval)
     }
  }, 1000)
 //req.session.test='123';
  //ws.send(req.session.test);

  // 监听客户端发来的数据，直接将信息原封不动返回回去
  ws.on("message", msg => {
    ws.send(msg)
  })
})
// .get('/user', function(req, res) {
//    // req.session.test='12223';
 
//     //res.send(req.session.test);
//   //req.cookies.test='12222223';

//    // res.send(req.session.test);
//   })
//   .post('/user', function(req, res) {
//   })



module.exports = router