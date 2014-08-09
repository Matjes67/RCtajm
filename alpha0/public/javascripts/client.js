console.log("hello world");

//(function() {
	var getNode = function(s) {
		return document.querySelector(s);
	};
	
	// get nodes
	var cartable = getNode(".car-table");
	var status = getNode(".chat-status span");
	var messages = getNode(".car-laps tbody");
	var textarea = getNode(".chat textarea");
	var chatName = getNode(".chat-name");

	//statusDefault = status.textContent; 

	
	try {
		var socket = io.connect("http://localhost:8080");
	} catch(e) {
		// error
	}
	if (socket !== undefined) {
		console.log("ok");


		//listen for output
		socket.on("laptime", function(data) {
			console.log("got laptime");
			
			//if(data.length) {
				//loop throug results
			//	for(var x = 0; x< data.length; x++) {
					var tr = document.createElement("tr");
					//message.setAttribute("class", "car-laps");
					var th = document.createElement("th");
					th.textContent = data.name;

					tr.appendChild(th);

					var td = document.createElement("td");
					td.textContent = data.laptime;
					tr.appendChild(td);
					var td = document.createElement("td");
					td.textContent = data.transponder;
					tr.appendChild(td);
					var td = document.createElement("td");
					td.textContent = data.strength;
					tr.appendChild(td);
					var td = document.createElement("td");
					td.textContent = data.hits;
					tr.appendChild(td);


					//message.textContent = "\n <th>" + data.name + "</th> \n <td>" + data.laptime + "</td> \n <td>" + data.transponder + "</td> \n <td>" + data.strength + "</td> \n <td>" + data.hits+"</td> \n ";//data[x].name + ": " + data[x].message;

					// append
					messages.appendChild(tr);
					messages.insertBefore(tr, messages.firstChild);
				//}
			//}
		});

		socket.on("cartable", function(data) {
			console.log(data);
			messages.parentNode.removeChild(messages);
			var drivertable = document.querySelector(".car-table table");
			drivertable.appendChild(document.createElement("tbody"));
			messages = document.querySelector(".car-table tbody");
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

		
	}

//})();
