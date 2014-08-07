(function() {
	var getNode = function(s) {
		return document.querySelector(s);
	},
	
	// get nodes
	status = getNode(".chat-status span"),
	messages = getNode(".chat-messages"),
	textarea = getNode(".chat textarea"),
	chatName = getNode(".chat-name");

	statusDefault = status.textContent, 

	setStatus = function(s) {
		status.textContent = s;

		if(s !== statusDefault) {
			var delay = setTimeout(function() {
				setStatus(statusDefault);
			},3000);
		}
	};

	setStatus("testing");

	try {
		var socket = io.connect("http://localhost:8080");
	} catch(e) {
		// error
	}
	if (socket !== undefined) {
		console.log("ok");


		//listen for output
		socket.on("output", function(data) {
			console.log("test");
			
			//if(data.length) {
				//loop throug results
			//	for(var x = 0; x< data.length; x++) {
					var message = document.createElement("div");
					message.setAttribute("class", "chat-message");
					message.textContent = data;//data[x].name + ": " + data[x].message;

					// append
					messages.appendChild(message);
					messages.insertBefore(message, messages.firstChild);
				//}
			//}
		});

		socket.on("status", function(data) {
			setStatus((typeof data === "object") ? data.message : data );
			if (data.clear === true) {
				textarea.value = "";
			}
		});
		// listen for keydown

		textarea.addEventListener("keydown", function(event) {
			var self = this,
				name = chatName.value;
			console.log(event.which);

			if(event.which ===13 && event.shiftKey === false) {
				console.log("send!");
				socket.emit("input", {
					name: name,
					message: self.value
				})
			}
		});
	}

})();