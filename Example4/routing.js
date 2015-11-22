var http = require('http'),
	url = require('url'),
	server;
	
var simpleHTTPResponder = function (req, res) {
	var url_parts = url.parse(req.url, true);
	if (url_parts.pathname === "/greetme") {
		res.writeHead(200, {
			"Content-Type": "text/plain"
		});
		var query = url_parts.query;
		if (query["name"] !== undefined) {
			res.end("Greetings " + query["name"]);
		}
		else {
			res.end("Greetings Anonymous");
		}
	}
	else {
		res.writeHead(404, {
			"Content-Type": "text/plain"
		});
		res.end("Only /greetme is implemented!");
	}
};
server = http.createServer(simpleHTTPResponder);
var port = 3000;
server.listen(port, function () {
	console.log("Server listening on port " + port);
});
