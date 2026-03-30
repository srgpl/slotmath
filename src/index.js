const library = require('./library.js');
const server = require('./server.js');

// Load library
if(!library.load())
	return console.log("Could not load library");

// The code in the following 'IF' is for demonstration purpose, to show
// how simple are the operations. Remove it in production mode.
if(true) {
	// Session ID should be assigned per player per game.
	const PlayerSessionID = "UNIQUE_STRING_ID";
	// Select game for current player session
	const game_to_play = "ultra_hot";
	if(library.select_game(game_to_play, PlayerSessionID)) {
		// Let's request 5 combinations
		for(var counter=0; counter < 5; counter++) {
			const bet_sum = 1.50;
			const combination = library.get_combination(bet_sum, PlayerSessionID);
			console.log("Combination: ", JSON.stringify(combination));
			// Save session data. YOu must provide this next time you
			// start session (see select_game above).
			// This is important, as some games are stateful, for
			// example games with free spins or bonuses.
			library.save_session(PlayerSessionID);
		}
	} else console.log("Could not select game " + game_to_play);
}

// start the HTTP server
server.start(8088);

// save game data and unload library when done.
// we have infinite waiting for incoming connections,
// so we never unload library in our scenatio.
// That is why it's commented out:
/*library.unload();*/
