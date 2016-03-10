var sensor = require('ds18x20')

sensor.getAll(function (err, tempObj) {
    console.log(tempObj);
});
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(3000);

app.listen(8080);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  sensor.getAll(function (err, tempObj){
    socket.emit ( 'news', tempObj);
  });
  
 // socket.emit('news', { hello: 'world' });
 // socket.on('my other event', function (data) {
 //   console.log(data);
 // });
});
