var express = require('express');                       // Express template
var path = require('path');                             // Express template
var favicon = require('static-favicon');                // Express template
var logger = require('morgan');                         // Express template
var cookieParser = require('cookie-parser');            // Express template
var bodyParser = require('body-parser');                // Express template

var routes = require('./routes/index');                 // Express template
var users = require('./routes/users');                  // Express template

var app = express();                                    // Express template

var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;
var SerialPort = require("serialport").SerialPort;
var sendData = "";
var serialPort;
var portName = '/dev/ttyACM0'; //change this to your serial port

// view engine setup                                    // Express template
app.set('views', path.join(__dirname, 'views'));        // Express template
app.set('view engine', 'jade');                         // Express template

app.use(favicon());                                     // Express template
app.use(logger('dev'));                                 // Express template
app.use(bodyParser.json());                             // Express template
app.use(bodyParser.urlencoded());                       // Express template
app.use(cookieParser());                                // Express template
app.use(express.static(path.join(__dirname, 'public'))); // Express template

app.use('/', routes);                                   // Express template
app.use('/users', users);                               // Express template

/// catch 404 and forward to error handler              // Express template
app.use(function(req, res, next) {                      // Express template
    var err = new Error('Not Found');                   // Express template
    err.status = 404;                                   // Express template
    next(err);                                          // Express template
});                                                     // Express template

/// error handlers                                      // Express template

// development error handler                            // Express template
// will print stacktrace                                                // Express template
if (app.get('env') === 'development') {                                                 // Express template
    app.use(function(err, req, res, next) {                                                 // Express template
        res.status(err.status || 500);                                              // Express template
        res.render('error', {                                               // Express template
            message: err.message,                                               // Express template
            error: err                                              // Express template
        });                                                 // Express template
    });                                                 // Express template
}                                               // Express template

// production error handler                                 // Express template
// no stacktraces leaked to user                            // Express template
app.use(function(err, req, res, next) {                     // Express template
    res.status(err.status || 500);                                  // Express template
    res.render('error', {                               // Express template
        message: err.message,                           // Express template
        error: {}                                       // Express template
    });                                                 // Express template
});                                                     // Express template


module.exports = app;                                   // Express template

// Listen to serial port
function serialListener()
{
    console.log("Opening serial device on"+portName);
    var receivedData = "";
    serialPort = new SerialPort(portName, {
        baudrate: 9600,
        // defaults for Arduino serial communication
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
    });
 
    serialPort.on("open", function () {
      console.log('open serial communication');
            // Listens to incoming data
        serialPort.on('data', function(data) {
             receivedData += data.toString();
          if (receivedData .indexOf('E') >= 0 && receivedData .indexOf('B') >= 0) {
           sendData = receivedData .substring(receivedData .indexOf('B') + 1, receivedData .indexOf('E'));
           receivedData = '';
           console.log(sendData);
            client.emit("output", sendData);
         }
         // send the incoming data to browser with websockets.
       //socketServer.emit('update', sendData);

      });  
    });  
}

mongo.connect("mongodb://localhost/chat", function(err,db) {
    if (err) throw err;

    serialListener();
    client.on("connection", function(socket) {

        var col = db.collection("messages"),
            sendStatus = function(s) {
                socket.emit("status", s);
            };
        
        // emit all messages
        col.find().limit(100).sort({_id: 1}).toArray(function(err,res) {
            if (err) throw err;
            socket.emit("output", res);
        });


        //wait for input
        socket.on("input", function(data) {
            console.log(data);
            var name = data.name, 
                message = data.message;

                col.insert({name: name, message: message }, function(err,result) {
                    if (err) throw err;
                    console.log("Inserted"+result);

                    // Emit latest message to ALL clients
                    client.emit("output", [data]);

                    sendStatus({
                        message: "Message sent",
                        clear: true
                    });
                });
        })
    });


});
