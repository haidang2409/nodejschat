var express = require('express');
var app = module.exports = express();
var http = require('http');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var server = http.createServer(app).listen(server_port, server_ip_address,function(){
	console.log('Listening port : %s ', server_port);
});
var io = require('socket.io').listen(server);
app.use(express.logger('dev'));
app.set('views',__dirname);
var oneYear = 31557600000;
app.use(express.static(__dirname + '/public', { maxAge: oneYear }));//Set cache trinh duyet khong th� bo
//{ maxAge: oneYear}
app.set('view engine','ejs');
//app.use(function (req, res, next) {
//	next();
//	});
app.configure(function () {
	app.use(express.bodyParser());
});

function setCurrentUrl(req, res, next) {
	app.set('CURR_URL', req.protocol + '://' + req.get('host') + req.originalUrl);
	next();
}

app.use(setCurrentUrl);

//need to be Above app.router
app.use(express.cookieParser('very secret ssssstttt'));
app.use(express.session());
//app.use(express.cookieParser());
app.use(function(req, res, next){
	res.locals.session = req.session;
	next();
});

app.use(express.json());
app.use(express.urlencoded());
//
var user = require('./process/register');
var chat = require('./process/chat');
var blog = require('./lib/blog/index');
app.use(blog);
//Router
app.get('/', function(req, res){
	res.render('./lib/index.ejs');
});
app.post('/login', function(req, res){
	user.login(req, function(data){
		res.json(data);
	})
});
app.get('/logout', function(req, res){
	delete req.session.userId;
	delete req.session.userEmail;
	res.redirect('/');
});
app.get('/register', function(req, res){
	res.render('./lib/register.ejs');
});
app.post('/active_key_account', function(req, res){
	user.checkKeyActive(req, function(status){
		res.json(status);
	});
});
//
app.post('/check_exist_email', function(req, res){
	user.checkExistEmail(req, function(status){
		res.json(status);
	});
});
app.post('/register', function(req, res){
	user.addUser(req, function(fn){
		res.json(fn);
	})
});
//Response session to client
app.get('/get_session', function(req, res){
	var data = {
		userId: req.session.userId,
		fullname: req.session.fullname,
		avatar: req.session.avatar
	};
	res.json(data);
});
app.post('/history_detail', function (req, res) {
	var userId1 = req.body.userId1;
	var userId2 = req.body.userId2;
	chat.getListChat(userId1, userId2, function(history){
		res.json(history);
	});
});
app.get('/history', function (req, res) {
	var userId1 = req.body.userId1;
	var userId2 = req.body.userId2;
	chat.getListUserChat("55a65ba3959f0dd438978065", function(history){
		res.render('./lib/history.ejs', {history: history});
	});
});


app.userOnline = [];
io.on('connection', function(socket){
	//Response all user online
	io.emit('AllUserOnline', app.userOnline);
	//Listen user online
	socket.on('userIdOnline', function(data){
		var add = true;
		for(var i = 0; i < app.userOnline.length; i++)
		{
			if(app.userOnline[i].userId == data.userId)
			{
				add = false;
				break;
			}
		}
		if(add == true)
		{
			app.userOnline.push(data);
			io.emit('AllUserOnline', app.userOnline);
		}
		console.log(app.userOnline);
	});
	//
	//socket.on('disconnect', function(data){
	//	console.log(data);
	//});
	//Listen user offline
	socket.on('userIdOffline', function(data){
		for(var i = 0; i < app.userOnline.length; i++)
		{
			if(app.userOnline[i].userId == data.userId)
			{
				app.userOnline.splice(i, 1);
				break;
			}
		}
		io.emit('AllUserOnline', app.userOnline);
	});
	//Get package content user send to server
	socket.on('ContentChatSend', function(data){
		chat.addContentChat(data, function(status){
			console.log(data);
			console.log(status);
			if(status == true)
			{
				io.emit("ResponseContentChat", data);
			}
			else
			{

			}
		});
	});
	socket.on('UserIsTyping', function(data){
		io.emit('ResponseUserTyping', data);
	});	
});




