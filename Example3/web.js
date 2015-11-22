var http = require('http');
var server;
server = http.createServer(function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	res.end("Hello World!");
	console.log("HTTP response sent");
});
var port = 3000;
server.listen(port, function () {
	console.log("Server listening on port " + port);
});