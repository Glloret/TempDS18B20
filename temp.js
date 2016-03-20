var sensor = require('ds18x20')

sensor.getAll(function (err, tempObj) {
    console.log(tempObj);
});
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(3000);

var interval = 3000;
app.listen(8080);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.get('/templogger', function (req, res){

res.sendFile(__dirname + '/logger.html');

});




io.on('connection', function (socket) {
  sensor.get('28-0415904c2bff',function (err, temp){
    socket.emit ( 'temperatura', temp);
    //console.log(temp);
  });
   setInterval(function(){
    sensor.get('28-0415904c2bff', function (err, temp){
      //console.log('intervalo');
      //console.log(temp);
      socket.emit ('temperatura',temp);
    });
  }, interval);
  socket.on('gettemp', function(data){
    sensor.get('28-0415904c2bff', function (err, temp){
      //console.log('intervalo');
      //console.log(temp);
      socket.emit ('templog',temp);
    });

  });


});
