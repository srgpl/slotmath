const http = require('http');
const path = require("path");
const fs = require('fs');
const library = require('./library.js');

function simple_server(port)
{	const content_type = (ext) => {
		switch(ext) {
			case "ico": return "image/icon";
			case "png": return "image/png";
			case "gif": return "image/gif";
			case "js": return "application/javascript";
			case "json": return "application/json";
		}
		return "text/html";
	};
	const server = http.createServer((req, res) => {
		// simple HTTP server
		if(req.method === 'GET')
		{	let m = req.url.match(/^[\/]*(\w+)\.(html|png|gif|ico|js|json)$/);
			let requested_file = (m && m.length) ? (m[1]+"."+m[2]) : Math.random().toString();
			let file_path = path.join(__dirname, "..", "html", requested_file);
			//console.log("GET request: ", req.url);
			const data = fs.readFile(file_path, {}, (err, data) => {
				if(err) {
					res.writeHead(301, {'Location': '/index.html?404'});
					res.end("");
					return;
				}
				res.writeHead(200, {'Content-Type': content_type(m && m.length?m[2]:"")});
				res.end(data);
			});
			return;
		}
		if(req.method !== 'POST') {
			res.writeHead(405, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({error: 'Only GET/POST requests!'}));
			return;
		}
		let body = "";
		req.on('data', chunk => {
			body += chunk;
			if(body.length > 1e6)
				req.socket.destroy();
		});
		req.on('end', () => {
			let result = process_client_request(JSON.parse(body));
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(result));
			body = "";
		});
	});
	server.listen(port, () => {
		console.log("Open in your browser:  http://127.0.0.1:" + port);
	});
}

function process_client_request(request) {
	let white_list = ["get_game_list", "select_game", "get_combination", "get_session_data"];
	// TODO: its not recommended to have public session_data in production environment
	if(request && request.action && white_list.indexOf(request.action) >= 0) {
		console.log("Request: ", JSON.stringify(request));
		const reply = library.action(request);
		console.log("Reply: ", JSON.stringify(reply));
		return reply;
	}
	else {
		return {
			"error": "forbidden"
		};
	}
}

module.exports = {
	"start": simple_server
};