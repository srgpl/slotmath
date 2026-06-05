const server = require('./server.js');

// start the HTTP server
server.start(8088);

// save game data and unload library when done.
// we have infinite waiting for incoming connections,
// so we never unload library in our scenatio.
// That is why it's commented out:
/*library.unload();*/
