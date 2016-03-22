
///////////// GET LOCAL IP //////////////////////////////////////
var os = require('os');
var ifaces = os.networkInterfaces();
var localIP;

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      //console.log(ifname, iface.address);
      localIP= iface.address;
      console.log(localIP);
    }
    ++alias;
  });
});

/////////////////////////////////////////////////////////////

var sensor = require('ds18x20')

//sensor.getAll(function (err, tempObj) {
//    console.log(tempObj);
//});




var express = require('express');
var socketPort = 3000;

var io = require('socket.io').listen(socketPort);
var path = require('path');
var app= express();
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var server = require('http').Server(app);

var interval = 3000; // Interval to update the thermometer socket send
app.listen(8080);



// TERMOMETRO (Will receive socket information from the server

// With static html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
var socketServer=  localIP + ":" + socketPort;


// with Jade generated HTML
app.get('/jade', function (req, res) {
  res.render('thermometer', { message: socketServer});
});

// TEMPERATURE LOGGER
app.get('/templogger', function (req, res){
  res.sendFile(__dirname + '/logger.html');
});


// Socket.io server functions

io.on('connection', function (socket) {
//  sensor.get('28-0415904c2bff',function (err, temp){
//    socket.emit ( 'temperatura', temp);
    //console.log(temp);
//  });
 

// Send temperature every intervalo through socket connection (Therometer)
  setInterval(function(){
    sensor.get('28-0415904c2bff', function (err, temp){
      //console.log('intervalo');
      //console.log(temp);
      socket.emit ('temperatura',temp);
    });
  }, interval);


/// Send temp on socket request (Logger)
  socket.on('gettemp', function(data){
    sensor.get('28-0415904c2bff', function (err, temp){
      //console.log('intervalo');
      //console.log(temp);
      socket.emit ('templog',temp);
    });

  });


});
