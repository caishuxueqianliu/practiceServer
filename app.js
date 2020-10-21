var createError = require('http-errors');
var express = require('express');
var expressWs = require('express-ws');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var websocket = require('./routes/websocket');
var chat = require('./routes/chat');
var app = express();
expressWs(app);
var bodyParser =require('body-parser');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use("/icon/", express.static(path.join(__dirname, './icon/')))
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('liuhao'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', chat);

app.use('/websocket', websocket);

var session = require('express-session')

app.use(session({
  secret: 'liuhao',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
// var cookieSession = require('cookie-session')
 
// app.set('trust proxy', 1) // trust first proxy
 
// app.use(cookieSession({
//   name: 'session',
//   keys: ['key1', 'key2']
// }))
 
// app.post('/pos',(req,res,next)=>{

//   //res.send({msg:req})
//   res.send({code:0,msg:req.body.xx})
//   console.log(req.body.xx)
// })
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
   //  app.listen(3000, () => {
   //    console.log('服务器启动成功, 请访问: http://localhost:3000')
   // })
mongoose.connect('mongodb://localhost/admin_db', {useNewUrlParser: true})
  .then(() => {
    console.log('连接数据库成功!!!')
    // 只有当连接上数据库后才去启动服务器
    app.listen(3000, () => {
      console.log('服务器启动成功, 请访问: http://localhost:3000')
   })
  })
  .catch(error => {
    console.error('连接数据库失败！！！', error)
  })
module.exports = app;
