console.log("admin db page");


try {
	var socket = io.connect(window.location.hostname);
} catch(e) {
	// error
}
if (socket !== undefined) {
	var sendTimeSync = function() {
		var now = new Date();
        var jsonDate = now.toJSON();

		socket.emit("mobiletime",jsonDate);

  	}
  	var sendNewRace = function() {
  		var inputbox = document.querySelector(".driver-name");
		var now = new Date();
        var jsonDate = now.toJSON();
        var racename = inputbox.value;
		socket.emit("newRace",racename,jsonDate);

  	}

  	var buttonLoadRace = function(indata) {
		console.log("buttonLoadRace"+indata);    	
    	socket.emit("loadRace", indata);
  	}
  	var buttonLoadHeat = function(indata) {
		console.log("buttonLoadHeat"+indata);    	
    	socket.emit("loadHeat", indata);
  	}
  	var updateRace = function(indata) {
		socket.emit("getRaces","");
  	}

  	var sendNewHeat = function() {
  		var inputbox = document.querySelector(".heat-name");
		var now = new Date();
        var jsonDate = now.toJSON();
        var heatname = inputbox.value;
		socket.emit("newHeat",heatname,jsonDate);

  	}

	console.log("socket ok");

	socket.emit("gettime","");
	socket.emit("getCurrentRace","");
	socket.emit("getRaces","");
	socket.emit("getHeats","");

	socket.on("servertime", function(data) {
		console.log("serverTime"+data);
		var servertimediv = document.querySelector(".servertime");
		var p = document.createElement("p");
		var p2 = document.createElement("p");
		var now = new Date();
        var jsonDate = now.toJSON();

		p.textContent = "Current server time: "+data;

		servertimediv.appendChild(p);
		p2.textContent = "Current mobile time: "+jsonDate;

		servertimediv.appendChild(p2);
	});
	socket.on("raceadded", function(data) {
		console.log("raceadded");
		socket.emit("getRaces","");
	});

	socket.on("races", function(data) {
		console.log("races: "+data);
		console.log(data);
		var messages = document.querySelector(".races-table tbody");
		messages.parentNode.removeChild(messages);
		var drivertable = document.querySelector(".races-table table");
		drivertable.appendChild(document.createElement("tbody"));
		messages = document.querySelector(".races-table tbody");
		if(data.length) {
			//loop throug results
			for(var x = 0; x< data.length; x++) {
				console.log(data[x].raceName);
				var tr = document.createElement("tr");
				//message.setAttribute("class", "car-laps");
				var th = document.createElement("th");
				th.textContent = data[x].raceName;

				tr.appendChild(th);

				
				var td = document.createElement("td");
				td.textContent = data[x].createDate;
				tr.appendChild(td);

				var td = document.createElement("td");
				td.textContent = data[x].nr;
				tr.appendChild(td);
				
				// Add more transponder input field and button
				
				//button
				var span = document.createElement('span');
				span.innerHTML = '<input type=button value="Load Race" onclick="buttonLoadRace(\''+data[x].nr+'\')" />';

				td.appendChild(span);
				tr.appendChild(td);

				
				// append
				messages.appendChild(tr);
				//messages.insert(tr, messages.firstChild);
			}
		}

	});
	socket.on("currentRace", function(data) {
		console.log("currentrace"+data[0].raceName);
		console.log(data);
		var currentdiv = document.querySelector(".current-race");
		currentdiv.textContent = "Current race: "+data[0].raceName;
	});

	socket.on("currentHeat", function(data) {
		if (data.length) {
			console.log("currentheat"+data[0].heatName);
			console.log(data);
			var currentdiv = document.querySelector(".current-heat");
			currentdiv.textContent = "Current Heat: "+data[0].heatName;
		}
	});

	socket.on("heats", function(data) {
		console.log("heats: "+data);
		console.log(data);
		var messages = document.querySelector(".heat-table tbody");
		messages.parentNode.removeChild(messages);
		var drivertable = document.querySelector(".heat-table table");
		drivertable.appendChild(document.createElement("tbody"));
		messages = document.querySelector(".heat-table tbody");
		if(data.length) {
			//loop throug results
			for(var x = 0; x< data.length; x++) {
				//console.log(data[x].heatName);
				var tr = document.createElement("tr");
				//message.setAttribute("class", "car-laps");
				var th = document.createElement("th");
				th.textContent = data[x].heatName;

				tr.appendChild(th);

				
				var td = document.createElement("td");
				td.textContent = data[x].createDate;
				tr.appendChild(td);

				var td = document.createElement("td");
				td.textContent = data[x].nr;
				tr.appendChild(td);

				var td = document.createElement("td");
				td.textContent = data[x].status; // status
				tr.appendChild(td);
				
				
				
				//button load heat
				var td = document.createElement("td");
				var span = document.createElement('span');
				span.innerHTML = '<input type=button value="Load Heat" onclick="buttonLoadHeat(\''+data[x].nr+'\')" />';

				td.appendChild(span);
				tr.appendChild(td);

				//button show results
				var td = document.createElement("td");
				var span = document.createElement('span');
				span.innerHTML = '<input type=button value="Show Results" onclick="window.open(\'/results/'+data[x].raceDay+'/'+data[x].nr+'\',\'_blank\',\'resizable=yes\')" />';

				td.appendChild(span);
				tr.appendChild(td);


				
				// append
				messages.appendChild(tr);
				//messages.insert(tr, messages.firstChild);
			}
		}

	});
	socket.on("heatadded", function(data) {
		console.log("heatadded");
		socket.emit("getHeats","");
	});
}
