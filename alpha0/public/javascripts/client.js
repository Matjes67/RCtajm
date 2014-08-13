meSpeak.loadConfig("/javascripts/mespeak_config.json");
meSpeak.loadVoice('/javascripts/voices/en/en-us.json');
//meSpeak.speak('hello world');

console.log("hello world");

var buttonGetLaps = function(indata) {
	
	console.log(".in-"+indata);
	
	socket.emit("getAllLaps", indata);
}
	var getNode = function(s) {
		return document.querySelector(s);
	};
	
	function msToTime(duration) {
        var milliseconds = parseInt(duration%1000)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        //milliseconds = (milliseconds < 1000) ? "0" + milliseconds : milliseconds;
        milliseconds = (parseInt(milliseconds) < 100) ? "0" + milliseconds : milliseconds;
        milliseconds = (parseInt(milliseconds) < 10) ? "0" + milliseconds : milliseconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    };
    function msToTimeNoHour(duration) {
        var milliseconds = parseInt(duration%1000)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        //milliseconds = (milliseconds < 1000) ? "0" + milliseconds : milliseconds;
        milliseconds = (parseInt(milliseconds) < 100) ? "0" + milliseconds : milliseconds;
        milliseconds = (parseInt(milliseconds) < 10) ? "0" + milliseconds : milliseconds;

        return minutes + ":" + seconds + "." + milliseconds;
    };
	// get nodes
	var cartable = getNode(".car-table");
	var status = getNode(".chat-status span");
	var messages = getNode(".car-laps tbody");
	var textarea = getNode(".chat textarea");
	var chatName = getNode(".chat-name");

	//statusDefault = status.textContent; 

	
	try {
		var socket = io.connect(window.location.hostname);
	} catch(e) {
		// error
	}
	if (socket !== undefined) {
		console.log("ok");
		socket.emit("firstconnect", "banan");

		//listen for output
		socket.on("laptimes", function(data) {
			console.log("got laptime"+data);
			var messages = document.querySelector(".car-laps tbody");
			messages.parentNode.removeChild(messages);
			var cartable = document.querySelector(".car-laps table");
			cartable.appendChild(document.createElement("tbody"));
			messages = document.querySelector(".car-laps tbody");
			
			if(data.length) {
				//loop throug results
				for(var x = 0; x< data.length; x++) {
					var tr = document.createElement("tr");
					//message.setAttribute("class", "car-laps");
					var th = document.createElement("th");
					th.textContent = data[x].name;
					tr.appendChild(th);
					
					var td = document.createElement("td");
					td.textContent = data[x].laps;
					tr.appendChild(td);
					
					var td = document.createElement("td");
					if (x==0) {
						td.textContent = 0;
					}
					else {
						var lapdiff =  parseInt(data[x].lapTime) - parseInt(data[x-1].lapTime);
						td.textContent = msToTimeNoHour( lapdiff);
					}
					tr.appendChild(td);
					
					var td = document.createElement("td");
					td.textContent = msToTime(data[x].lapTime);
					tr.appendChild(td);

					var td = document.createElement("td");
					td.textContent = data[x].transponder;
					tr.appendChild(td);
					
					var td = document.createElement("td");
					td.textContent = data[x].strength;
					tr.appendChild(td);
					
					var td = document.createElement("td");
					td.textContent = data[x].hits;
					tr.appendChild(td);


					//message.textContent = "\n <th>" + data.name + "</th> \n <td>" + data.laptime + "</td> \n <td>" + data.transponder + "</td> \n <td>" + data.strength + "</td> \n <td>" + data.hits+"</td> \n ";//data[x].name + ": " + data[x].message;

					// append
					messages.appendChild(tr);
					messages.insertBefore(tr, messages.firstChild);
				}
			}
		});

		socket.on("cartable", function(data) {
			console.log(data);
			var driverbox = document.querySelector(".driver-table tbody");
			driverbox.parentNode.removeChild(driverbox);
			var drivertable = document.querySelector(".driver-table table");
			drivertable.appendChild(document.createElement("tbody"));
			driverbox = document.querySelector(".driver-table tbody");
			

			//messages.parentNode.removeChild(messages);
			//var drivertable = document.querySelector(".car-table table");
			//drivertable.appendChild(document.createElement("tbody"));
			//messages = document.querySelector(".car-table tbody");
			if(data.length) {
				//loop throug results
				for(var x = 0; x< data.length; x++) {
					var tr = document.createElement("tr");
					//message.setAttribute("class", "car-laps");
					var th = document.createElement("th");
					th.textContent = data[x].name;

					tr.appendChild(th);

					
					var td = document.createElement("td");
					td.textContent = data[x].laps;
					tr.appendChild(td);

					var td = document.createElement("td");
					td.textContent = msToTime(data[x].totalTime);
					tr.appendChild(td);

					//last lap
					var td = document.createElement("td");
					td.textContent = msToTimeNoHour( data[x].lastLapTime);
					tr.appendChild(td);

					// best lap
					var td = document.createElement("td");
					td.textContent = msToTimeNoHour( data[x].bestLap );
					tr.appendChild(td);

					// avg lap
					var td = document.createElement("td");
					td.textContent = msToTimeNoHour( data[x].totalTime / (data[x].laps) );
					tr.appendChild(td);
					
					//button
					var td = document.createElement("td");
					var span = document.createElement('span');
					span.innerHTML = '<input type=button value="+" onclick="buttonGetLaps(\''+data[x].name+'\')" />';

					td.appendChild(span);
					tr.appendChild(td);

					
					// append
					driverbox.appendChild(tr);
					//messages.insert(tr, messages.firstChild);
				}
			}
		});

		socket.on("currentHeat", function(data) {
			if (data.length) {
				console.log("currentheat"+data[0].heatName);
				console.log(data);
				var currentdiv = document.querySelector(".current-heat");
				currentdiv.textContent = "Current Heat: "+data[0].heatName;
			}
		});

		socket.on("laptime", function(data) {
			
				console.log("laptime"+data.name);
				console.log(data);
				meSpeak.speak(""+data.name+", "+data.laptime/1000);
			
		});

		
	}

//})();
