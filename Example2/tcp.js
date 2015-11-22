"use strict";
const fs = require('fs'),
	net = require('net'),
	filename = 'todos.txt',
	server = net.createServer(function (connection) {
		//what to do on connect
		console.log("Subscriber connected");
		connection.write("Now watching " + filename +
			" for changes\n");
		var watcher = fs.watch(filename, function () {
			connection.write("File " + filename +
				" has changed: " + Date.now() + "\n");
		});
	
		//what to do on disconnect
		connection.on('close', function () {
			console.log("Subscriber disconnected");
			watcher.close();
		});
	});
	
server.listen(5432, function () {
	console.log("Listening to subscribers...");
});