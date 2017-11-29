var express = require('express');
var app  = express();
var server = require('http').createServer(app);
server.listen(process.env.PORT || 3000);
app.set('views',__dirname);
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
var io = require('socket.io').listen(server);
app.get('/test', function(req, res){
    res.render('./lib/test.ejs');
})
io.sockets.on('connection', function(socket){
    console.log(socket.id);
    socket.send(socket.id);
    //socket.on('login', function (name) {
    //    console.log(name + "login");
    //    socket.emit('login_ok', name + "login ok");
    //
    //});
    socket.emit('info', 'Hello world');
    //socket.broadcast.emit('info', 'Hello world');
});
// note, io.listen() will create a http server for you
//var io = require('socket.io').listen(80);
//
//io.sockets.on('connection', function (socket) {
//    io.sockets.emit('this', { will: 'be received by everyone connected'});
//
//    socket.on('private message', function (from, msg) {
//        console.log('I received a private message by ', from, ' saying ', msg);
//    });
//
//    socket.on('disconnect', function () {
//        sockets.emit('user disconnected');
//    });
//});
//io.sockets.socket(id).emit('private message', msg, mysocket.id)