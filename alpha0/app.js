var express = require('express');                       // Express template
var path = require('path');                             // Express template
var favicon = require('serve-favicon');                // Express template
var logger = require('morgan');                         // Express template
var cookieParser = require('cookie-parser');            // Express template
var bodyParser = require('body-parser');                // Express template
var debug = require('debug')('alpha0');

var routes = require('./routes/index');                 // Express template
var users = require('./routes/users');                  // Express template
var admin = require('./routes/admin');

var serialPort;

var argv = require('minimist')(process.argv.slice(2)); // hande input arguments
console.log(argv);

var portName = argv.p; 
var AMB = 1;
var MINIZ = 2;
var ARDUINO = 3;

if ( argv.d == "amb") {
    var decoderType = AMB;    
} else if ( argv.d == "miniz") {
    var decoderType = MINIZ;    
} else if ( argv.d == "arduino") {
    var decoderType = ARDUINO;    
}
else {
    var decoderType = 0;
    console.log("No decoder specified, will only print incomming serial traffic. Use -d to set decoder type.")
}
debug(decoderType);

var io = require('socket.io');
//var spawn = require('child_process').spawn;
var exec = require('child_process').exec, child;


var app = express(),
mongo = require('mongodb'),
server = require('http').createServer(app).listen(8080),
client = io.listen(server);

//debug('Express server listening on port ' + server.address().port);

var SerialPort = require("serialport").SerialPort;
var sendData = "";

//var portName = '/dev/ttyACM0'; //change this to your serial port


// view engine setup                                    // Express template
app.set('views', path.join(__dirname, 'views'));        // Express template
app.set('view engine', 'jade');                         // Express template

app.use(favicon(__dirname + '/public/images/favicon.ico')); // Express template
app.use(logger('dev'));                                 // Express template
app.use(bodyParser.json());                             // Express template
app.use(bodyParser.urlencoded({
  extended: true
}));                       // Express template
app.use(cookieParser());                                // Express template
app.use(express.static(path.join(__dirname, 'public'))); // Express template

app.use('/', routes);                                   // Express template
app.use('/users', users);                               // Express template
app.use('/admin', admin); 

/// catch 404 and forward to error handler              // Express template
app.use(function(req, res, next) {                      // Express template
    var err = new Error('Not Found');                   // Express template
    err.status = 404;                                   // Express template
    next(err);                                          // Express template
});                                                     // Express template

/// error handlers                                      // Express template

// development error handler                            // Express template
// will print stacktrace                                // Express template
if (app.get('env') === 'development') {                 // Express template
    app.use(function(err, req, res, next) {             // Express template
        res.status(err.status || 500);                  // Express template
        res.render('error', {                           // Express template
            message: err.message,                       // Express template
            error: err                                  // Express template
        });                                             // Express template
    });                                                 // Express template
}                                                       // Express template

// production error handler                             // Express template
// no stacktraces leaked to user                        // Express template
app.use(function(err, req, res, next) {                 // Express template
    res.status(err.status || 500);                      // Express template
    res.render('error', {                               // Express template
        message: err.message,                           // Express template
        error: {}                                       // Express template
    });                                                 // Express template
});                                                     // Express template


module.exports = app;                                   // Express template



// Manage what race data to get
var globalRaceNr = 0;
var globalFirstTime = true;  // tells if the first car have past the timing loop at begining of race, official time start when first car pass on race start. 
var globalHeatNr = 0;
var globalStartTime = 0;  // remove startTime from all times when counting laps


function decodeAMB(indata,db,cb) {

        return out;
};

function inputDataToDB(indata,db, cb) {
    debug("inputfunction:"+indata.transponder);
    var colLaps = db.collection("laptimes"+globalRaceNr+"x"+globalHeatNr);
    var colDrivers = db.collection("drivers");
    var colRace = db.collection("currentrace"+globalRaceNr+"x"+globalHeatNr);
    var colAdmRace = db.collection("races");
    var colAdmHeat = db.collection("heats"+globalRaceNr);

    var name2 =  indata.transponder;
    var BestLap = 99999999999;

    if (globalFirstTime) {
        globalStartTime = indata.time;
        globalFirstTime = false;
    }
    indata.time = indata.time - globalStartTime;
    colDrivers.findOne({ transponders: indata.transponder}, function(err, document, name2) {
        if (err) throw err;
        if (document !== null) {
            name2 = document.name;
        } else {
            name2 = indata.transponder;
        }
        
        colLaps.find({ name: name2 }, {'limit':1, 'sort':[[ 'lapTime', 'desc']]}).toArray(function(err, docs) {            
            var lap;
            if (docs.length>0) {
                
                lap = (indata.time - docs[0].lapTime);
                var totallaps = docs[0].laps+1;
                debug(indata.transponder+"Returned #" + docs[0].lapTime + " serial: "+indata.time+" sum:" + lap);  
                
                //client.emit("laptime", "name: "+name2+" tran: "+splitData[1]+" laptime: "+lap/1000+" strength: "+splitData[3]+" hits: "+splitData[4]+" ");
                
            } else {
                //console.log("no laps");
                lap = "first lap";
                totallaps = 0;
                    //"name: "+name2+" tran: "+splitData[1]+" laptime: first lap"+" strength: "+splitData[3]+" hits: "+splitData[4]+" ");
        
            }
            client.emit("laptime", {
                    name: name2,
                    laptime: lap,
                    transponder: indata.transponder,
                    strength: indata.strength,
                    hits: indata.hits,
                    laps: totallaps
            });

            colLaps.insert({name: name2, 
                         transponder: indata.transponder,
                             lapTime: parseInt(indata.time), 
                            strength: parseInt(indata.strength), 
                                hits: parseInt(indata.hits),
                                laps: totallaps }, 
                function(err,result) {
                    if (err) throw err;
                }
            );

            colRace.find({name: name2}).toArray(function(err,res) {

                if (err) throw err;
                debug("best"+BestLap);
                if (res.length>0) {
                    debug("best result"+res[0].bestLap);
                    if (parseInt(res[0].bestLap)>=lap || isNaN(res[0].bestLap) ) {
                        BestLap = lap;
                        debug("best new best");

                    } else {
                        BestLap = res[0].bestLap;
                    }
                } else {
                    BestLap = null;
                }
                debug(BestLap);
                colRace.update({name: name2}, {  name: name2, totalTime:parseInt(indata.time), laps: parseInt(totallaps), lastLapTime: lap, bestLap: parseInt(BestLap) },{upsert: true},
                function(err,result) {
                    if (err) throw err;
                    //console.log("racetable result");
                }

            );
            });
            //console.log("race insert:"+name2+splitData[0]+":"+splitData[1]+":"+splitData[2]+":");
            
            colRace.find({}).sort({laps: -1, totalTime: 1}).toArray(function(err,res) {
            //colRace.find({}, {  "sort": [['laps','asc'], ['totalTime','desc']] }, function(err,result) {
                    if (err) throw err;
                    //console.log("cartable result"+res);
                    client.emit("cartable", res);
                }

            );
        });
    });

    cb();
}
mongo.connect("mongodb://localhost/rctajm", function(err,db) {
    if (err) throw err;

    var colLaps = db.collection("laptimes"+globalRaceNr+"x"+globalHeatNr);
    var colDrivers = db.collection("drivers");
    var colRace = db.collection("currentrace"+globalRaceNr+"x"+globalHeatNr);
    var colAdmRace = db.collection("races");
    var colAdmHeat = db.collection("heats"+globalRaceNr);

    

    console.log("Opening serial device on "+portName);
    var receivedData = "";
    if (decoderType == AMB) {
        serialPort = new SerialPort(portName, {
            baudrate: 9600,
            // defaults for Arduino serial communication
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });
    } else if (decoderType == ARDUINO) {
        serialPort = new SerialPort(portName, {
            baudrate: 9600,
            // defaults for Arduino serial communication
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });
    } else if (decoderType == MINIZ) {
        serialPort = new SerialPort(portName, {
            baudrate: 19200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });
    }else {
        serialPort = new SerialPort(portName, {
            baudrate: 9600,
            // defaults for Arduino serial communication
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });
    }

 
    serialPort.on("open", function () {
      console.log('serial communication is open');
            // Listens to incoming data
        serialPort.on('data', function(data) {
            receivedData += data.toString();
            
            if (decoderType == AMB) {
                if (receivedData.substring(receivedData.indexOf('@')).indexOf('\n') >= 0 && receivedData.indexOf('@') >= 0) {
                    var result = receivedData.substring(receivedData.indexOf('@'));
                    receivedData = receivedData.substring(receivedData.indexOf('@'));
                    receivedData = receivedData.substring(receivedData.indexOf('\n'));
                    result = result.split('\t');
                    debug(result[1]+":"+result[2]+":"+result[3]+":"+result[4]+":"+result[5]+":");
                    var time = result[4]*1000;
                    debug(time);

                    inputDataToDB({transponder: result[3], time: time, strength: result[5], hits: result[6]},db, function(){});
                }
            } else if (decoderType == ARDUINO) {
                if (receivedData[0] !== 'C' && receivedData.length>2 && receivedData.indexOf('C') >= 0) {
                    debug("FIRST NOT START CHAR");
                    receivedData = receivedData.substring(receivedData.indexOf('C'));
                }
                if (receivedData.indexOf('\n') >= 0 && receivedData.indexOf('C') >= 0) {
                    
                    var splitData2 = receivedData.substring(receivedData.indexOf('C'), receivedData.indexOf('\n')+1);
                    receivedData = receivedData.replace(splitData2,"");
                    debug(splitData2);
                    var splitData = splitData2.split(":");
                    debug("."+receivedData);

                    //receivedData = "";
                    
                    if (splitData.length>4) {
                        inputDataToDB({transponder: splitData[1], time: splitData[2], strength: splitData[3], hits: splitData[4]},db, function(){});
                        
                        
                    }
                    
                }
            } else if (decoderType == MINIZ) { 
		if (receivedData.substring(receivedData.indexOf('#')).indexOf('$') >= 0 && receivedData.indexOf('#') >= 0) {
			if ( receivedData.indexOf('U') == 1 ) {
				debug("Utime"+receivedData);
				debug("uindex "+receivedData.indexOf('U'));
				receivedData = ""+receivedData.substring(9);
			} 
                        if ( receivedData.indexOf('P') == 1 ) {
                                debug("Pcar"+receivedData);
				var t2 = receivedData.substring(receivedData.indexOf('P')+1,receivedData.indexOf('P')+3);
debug("t2"+t2);
				var t3 = receivedData.substring(receivedData.indexOf('P')+3,receivedData.indexOf('P')+11);
				var carID = parseInt(t2,16);
				var carTime = parseInt(t3,16);
				debug("CarID"+carID+"CarTime"+carTime);
 debug("Pindex "+receivedData.indexOf('P'));
				inputDataToDB({transponder: carID, time: carTime, strength: 1, hits: 1},db, function(){});
				receivedData = ""+receivedData.substring(11);
                        } if ( ( receivedData.indexOf('U') != 1 ) && ( receivedData.indexOf('P') != 1 ) ){
				debug("strange beginning, cutting 1 char. "+receivedData);
				receivedData = receivedData.substring(1);
			}
			//debug(receivedData);
                	//receivedData = "";
                }
            }
            else {
                debug(receivedData);
                receivedData = "";

            }
         // send the incoming data to browser with websockets.
       //socketServer.emit('update', sendData);

      });  
    });  

    client.on("connection", function(socket) {

        // send inital data
        colAdmHeat.find({nr: globalHeatNr}).sort({nr:-1}).limit(1).toArray(function(err,res) {
            if (err) throw err;
            debug(res);
            client.emit("currentHeat", res);
        });

        //wait for input
        socket.on("adddriver", function(data) {
            console.log(data);
            //var colDrivers = db.collection("drivers");
            colDrivers.insert({name: data.name, transponders: [ data.transponder ]}, function(err,result) {
                if (err) throw err;
                console.log("inserted "+data.name+" "+data.transponder);
            });
            //colDrivers = db.collection("drivers");
            
            colDrivers.find().sort({name: 1}).toArray(function(err,res) {
                if (err) throw err;
                socket.emit("drivertable", res);
            });
            
        });
        socket.on("addMoreTrans", function(data) {
            console.log(data);
            
            //var colDrivers = db.collection("drivers");

            var o_id = require('mongodb').ObjectID(data.id);
            if (data.transponder.length>1) {
                colDrivers.update({ _id: o_id }, { $addToSet: { transponders: data.transponder}},function(err,res) {
                    if (err) throw err;
                    console.log(res);
                    console.log("updated transponder number");

                    var colDrivers = db.collection("drivers");
            
                    colDrivers.find().sort({name: 1}).toArray(function(err,res) {
                        if (err) throw err;
                        socket.emit("drivertable", res);
                    });
                });
            }
            
            colDrivers.find({ _id: o_id }).toArray(function(err,res) {
                if (err) throw err;
                console.log(res);
            });
            
        });
        socket.on("getdriver", function(data) {
            debug(data);
            //var colDrivers = db.collection("drivers");
            
            colDrivers.find().sort({name: 1}).toArray(function(err,res) {
                if (err) throw err;
                socket.emit("drivertable", res);
            });
            
            
        });
        socket.on("racecommand", function(data) {
            console.log(data);
            if (data == "start"){
                // set globalFirstTime true
                globalFirstTime = true;
                serialPort.write("Start");
                

                child = exec('mpg123 sound/AirHorn-SoundBible.com-1561808001.mp3',
                  function (error, stdout, stderr) {
                    //console.log('stdout: ' + stdout);
                    //console.log('stderr: ' + stderr);
                    if (error !== null) {
                      console.log('exec error: ' + error);
                    }
                });
                colAdmHeat.update({nr: globalHeatNr}, { $set: {status: "Started"} },{upsert: false}, function(err,result) {
                    if (err) throw err;
                });

            }
            if (data == "stop"){
                serialPort.write("Quit");
                colAdmHeat.update({nr: globalHeatNr}, { $set: {status: "Stopped"} },{upsert: false}, function(err,result) {
                    if (err) throw err;
                });
            }
            if (data == "clear"){
                //var colRace = db.collection("currentrace");
                colRace.remove({}, function(err,res) {
                    if (err) throw err;
                });
                //var colLaps = db.collection("laptimes");
                colLaps.remove({}, function(err,res) {
                    if (err) throw err;
                });
            }
                
            
        });
        socket.on("getAllLaps", function(data) {
            console.log(data);
            
            //var colLaps = db.collection("laptimes");
            colLaps.find({ name: data}).sort({laps: 1}).toArray( function(err,res) {
                if (err) throw err;
                socket.emit("laptimes", res);
            });
            
                
            
        });
        socket.on("gettime", function(data) {
            var now = new Date();
            var jsonDate = now.toJSON();

            socket.emit("servertime", jsonDate);
        });
        socket.on("mobiletime", function(data) {
            // Somehow set system time to what is recieved
            debug(data);
        });
        socket.on("newRace", function(raceName, jsonDate) {
            // Somehow set system time to what is recieved
            var nr = 0;
            colAdmRace.find({}).sort({nr:-1}).limit(1).toArray(function(err,res) {
                debug(res);
                if (res.length) {
                    debug("res iftrue"+res[0].nr);
                    nr = res[0].nr+1;
                }
                else {
                    debug("res if false");
                    nr = 1;
                }
                
                debug("racenumber"+nr);
                colAdmRace.insert({raceName: raceName, 
                             createDate: jsonDate,
                                     nr: parseInt(nr) }, 
                function(err,result) {
                    if (err) throw err;
                    debug(result);
                    socket.emit("raceadded", "ok");
                });
            });
            
            //debug(data);
        });

        socket.on("getRaces", function(indata) {
            debug("getRaces")
            colAdmRace.find({}).sort({nr:-1}).toArray(function(err,res) {
                if (err) throw err;
                debug(res);
                socket.emit("races", res);
            });
        });

        socket.on("loadRace", function(indata) {
            debug("loadRace "+indata)
            globalRaceNr = parseInt(indata);

            colLaps = db.collection("laptimes"+globalRaceNr);
            colDrivers = db.collection("drivers");
            colRace = db.collection("currentrace"+globalRaceNr);
            colAdmHeat = db.collection("heats"+globalRaceNr);
            // Load databases

            colAdmRace.find({nr: globalRaceNr}).sort({nr:-1}).limit(1).toArray(function(err,res) {
                if (err) throw err;
                debug(res);
                socket.emit("currentRace", res);
            });
            colAdmHeat.find({}).sort({_id:-1}).toArray(function(err,res) {
                if (err) throw err;
                socket.emit("heats", res);
            });
        });

        
        socket.on("getCurrentRace", function(indata) {
            debug("getCurrentRace "+indata)
            colAdmRace.find({nr: globalRaceNr}).sort({nr:-1}).limit(1).toArray(function(err,res) {
                if (err) throw err;
                debug(res);
                socket.emit("currentRace", res);
            });
            // Load databases
        });

        socket.on("newHeat", function(heatName, jsonDate) {
            // Somehow set system time to what is recieved
            var nr = 0;
            //colAdmHeat = db.collection("heats"+globalRaceNr);
            colAdmHeat.find({}).sort({nr:-1}).limit(1).toArray(function(err,res) {
                debug(res);
                if (res.length) {
                    debug("res iftrue"+res[0].nr);
                    nr = res[0].nr+1;
                }
                else {
                    debug("res if false");
                    nr = 1;
                }
                
                debug("heatnumber"+nr);
                colAdmHeat.insert({heatName: heatName, 
                             createDate: jsonDate,
                                     nr: parseInt(nr),
                                 status: "pending", 
                                raceDay: globalRaceNr}, 
                function(err,result) {
                    if (err) throw err;
                    debug(result);
                    socket.emit("heatadded", "ok");
                });
            });
            
            //debug(data);
        });
        socket.on("getHeats", function(indata) {
            debug("getHeats")
            colAdmHeat.find({}).sort({nr:1}).toArray(function(err,res) {
                if (err) throw err;
                debug(res);
                socket.emit("heats", res);
            });
        });
        socket.on("loadHeat", function(indata) {
            debug("loadHeat"+indata);
            globalHeatNr = parseInt(indata);

            colLaps = db.collection("laptimes"+globalRaceNr+"x"+globalHeatNr);
            colDrivers = db.collection("drivers");
            colRace = db.collection("currentrace"+globalRaceNr+"x"+globalHeatNr);

            colAdmHeat = db.collection("heats"+globalRaceNr);
            // Load databases

            colAdmHeat.find({nr: globalHeatNr}).sort({nr:-1}).limit(1).toArray(function(err,res) {
                if (err) throw err;
                debug(res);
                client.emit("currentHeat", res);
            });

            
            
        });
        socket.on("getCurrentHeat", function(indata) {
            debug("getCurrentHeat "+indata)
            colAdmHeat.find({nr: globalHeatNr}).sort({nr:-1}).limit(1).toArray(function(err,res) {
                if (err) throw err;
                debug(res);
                socket.emit("currentHeat", res);
            });
            // Load databases
        });

    });


});
