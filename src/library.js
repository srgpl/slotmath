const probity = require('probity');
const storage = require('./storage.js');
const games = require('./games.js');

let save_timer = 0;

function load_game(game) {
	let game_data = storage.get("game", game);
	let request = {
		"action": "set_game_definition",
		"game_id": game,
		"definition": games.definition[game],
		"context": game_data
	};
	let result = module.exports.action(request);
	if(result && result.reply && result.reply.success)
		console.log("Game "+game+" loaded.");
}

function save_game_data(game) {
	let request = {
		"action": "get_game_context",
		"game_id": game
	};
	let result = module.exports.action(request);
	if(result && result.reply && result.reply.success)
		console.log("Game data saved for "+game);
}

function save_game_data_all() {
	for(var g in games.definition)
		save_game_data(g);
}

module.exports = {
	"load" : function() {
		// Load library
		if(!probity.load())
			return console.log("Could not load probity");
		// optional: specify some options:
		let options_action = {
			"action": "set_options",
			"options": {
				"log": {
					"file": "/tmp/rgs-math.log", // default: null
					"stdout": true // default: false
				}
			}
		};
		probity.action(options_action);
		// load game definitions
		for(var g in games.definition)
			load_game(g);
		// save game data every 15 minutes
		save_timer = setTimeout(save_game_data_all, 1000*30);
		return true;
	},
	"unload": function() {
		save_game_data_all();
		if(save_timer) clearTimeout(save_timer);
	},
	"action": function(request) {
		return probity.action(request);
	},
	"select_game": function(game, session_id) {
		const request  = {
			"action": "select_game",
			"game_id": game,
			"session_id": session_id,
			"session_data": storage.get("player", session_id)
		};
		let result = module.exports.action(request);
		if(result && result.reply && result.reply.success) {
			console.log("Game "+game+" selected for "+session_id);
			return true;
		}
		return false;
	},
	"get_combination": function(bet_sum, session_id) {
		const request = {
			"action": "get_combination",
			"session_id": session_id,
			"bet_sum": bet_sum
		};
		const result = module.exports.action(JSON.stringify(request));
		return result && result.reply && result.reply.success ? result.reply.combination : null;
	},
	"save_session": function(session_id) {
		const request = {
			"action": "get_session_data",
			"session_id": session_id
		};
		const result = module.exports.action(JSON.stringify(request));
		if(result && result.reply && result.reply.success)
			storage.set("player", session_id, result.reply.session_data);
	}
};
