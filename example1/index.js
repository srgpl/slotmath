const probity = require('probity');
const games = require('../games/games.js');
//
// Note: we do not check probity.action() return values
// to simplify the code.
//

// Load probity
if(!probity.load()) {
	console.log("Could not load probity");
	return;
}

// Enable logging
let options_action = {
	"action": "set_options",
	"options": {
		"log": {
			"stdout": true // default: false
		}
	}
};
probity.action(options_action);

// Load game definitions
for(var game_id in games.definition) {
	let definition_action = {
		"action": "set_game_definition",
		"game_id": game_id,
		"definition": games.definition[game_id]
	};
	probity.action(definition_action);
}

// Player session ID (some unique string)
const PlayerSessionID = "SESSIONID";

// Game we're going to play
const GameToPlay = "ultra_hot";

// Bet sum
const BetSum = 2.50;

// Select game to play
const definition_select  = {
	"action": "select_game",
	"game_id": GameToPlay,
	"session_id": PlayerSessionID
};
let result = probity.action(definition_select);

// Let's accumulate some statistics
let statistics = {
	"total_bet": 0,
	"total_win": 0,
	"counter": 0
};

// Request 10 game combinations
for(var counter=0; counter < 10; counter++) {
	const request_combination = {
		"action": "get_combination",
		"session_id": PlayerSessionID,
		"bet_sum": BetSum
	};
	const result = probity.action(request_combination);
	if(result && result.reply && result.reply.success) {
		// count statistics
		statistics.total_bet += result.reply.combination.actual.bet;
		statistics.total_win += result.reply.combination.actual.win;
		statistics.counter++;
		// show generated game combination
		console.log("Combination"+statistics.counter+": ",
			JSON.stringify(result.reply.combination));
	}
}

// Let's show statictics:
console.log("Bet count: " + statistics.counter);
console.log("Total bet sum: " + Number(statistics.total_bet).toFixed(2));
console.log("Total win sum: " + Number(statistics.total_win).toFixed(2));
console.log("RTP: " + Number(statistics.total_win/statistics.total_bet).toFixed(3));
// Note: you need to make 1M or more bets to see more accurate RTP.
