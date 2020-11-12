// var WebSocket = require('ws');
// var wss = new WebSocket.Server({ port:3000 });
//
// wss.on('connection', function(ws) {
//     console.log('server: 收到连接');
//     ws.on('message', function(message) {
//         console.log('server: 收到消息', message);
//     });
//     ws.send('server: hi，客户端');
// });
const express = require("express");
const router = express.Router()
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/test');

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function incoming(data) {
    console.log(data);
});
module.exports = router;
