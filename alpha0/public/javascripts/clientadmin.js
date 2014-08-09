console.log("adminpage");


	
	// get nodes
	namebox = document.querySelector(".driver-name");
	transbox = document.querySelector(".driver-trans");
	var messages = document.querySelector(".driver-table tbody");

	try {
		var socket = io.connect(window.location.hostname);
	} catch(e) {
		// error
	}
	if (socket !== undefined) {
		console.log("socket ok");

		socket.emit("getdriver","getdriver");

	var senddriver = function() {
    	console.log('senddriver'+namebox.value);

		socket.emit("adddriver", {
			name: namebox.value,
			transponder: transbox.value
		})

  	}
  	var buttonAddNumber = function(indata) {
  		var numberbox = document.querySelector(".in-"+indata);
		console.log(".in-"+indata);
    	console.log('buttonaddnumber'+numberbox.value);
    	
    	socket.emit("addMoreTrans", {
    		id: indata,
    		transponder: numberbox.value
    	});
  	}

  	var startRace = function() {
  		console.log("startracebutton");
    	socket.emit("racecommand", "start");
  	}
  	var stopRace = function() {
  		console.log("STOPracebutton");
    	socket.emit("racecommand", "stop");
  	}
  	var clearRace = function() {
  		console.log("CLEARracebutton");
    	socket.emit("racecommand", "clear");
  	}

		//listen for output
		socket.on("drivertable", function(data) {
			console.log(data);
			messages.parentNode.removeChild(messages);
			var drivertable = document.querySelector(".driver-table table");
			drivertable.appendChild(document.createElement("tbody"));
			messages = document.querySelector(".driver-table tbody");
			if(data.length) {
				//loop throug results
				for(var x = 0; x< data.length; x++) {
					var tr = document.createElement("tr");
					//message.setAttribute("class", "car-laps");
					var th = document.createElement("th");
					th.textContent = data[x].name;

					tr.appendChild(th);

					for (var i=0;i<data[x].transponders.length;i++) {
						var td = document.createElement("td");
						td.textContent = data[x].transponders[i];
						tr.appendChild(td);
					}
					// Add more transponder input field and button
					var td = document.createElement("td");
					var textfield = document.createElement("input");
					textfield.type = "text";
					textfield.className = "in-"+data[x]._id;
					td.appendChild(textfield);
					tr.appendChild(td);
					//button
					var span = document.createElement('span');
					span.innerHTML = '<input type=button value="Add number" onclick="buttonAddNumber(\''+data[x]._id+'\')" />';

					td.appendChild(span);
					tr.appendChild(td);

					
					// append
					messages.appendChild(tr);
					//messages.insert(tr, messages.firstChild);
				}
			}
		});

		socket.on("error", function(data) {
			console.log("error"+data);
			
			
		});

		
	}