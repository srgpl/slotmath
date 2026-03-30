const path = require("path");
const fs = require('fs');

//
// We use disk i/o operation here to simplify the project.
// It's better to use database in real project.
// Just modify get and set methobds below;
//

// create the folder
let storage_path = path.join(__dirname, "..", ".storage");
try { fs.mkdirSync(storage_path); }catch(e) { }

module.exports = {
	//
	//	parameters:
	//		type - either "game" or "player"
	//		key - game name for "game" and player session ID for "player" type
	//	returns: string or null
	//
	"get" : function(type, key) {
		let storage_path = path.join(__dirname, "..", ".storage", type+"_"+key+".dat");
		let result = null;
		try {
			result = String(fs.readFileSync(storage_path));
		} catch(e) {
			//console.log("Read error: " + storage_path);
		}
		return result;
	},
	//
	//	parameters:
	//		type, key - see above
	//		value - string to store.
	//	if value is null, the storage file is removed
	//
	"set" : function(type, key, value) {
		let storage_path = path.join(__dirname, "..", ".storage", type+"_"+key+".dat"), err=0;
		try
		{	if(value) fs.writeFileSync(storage_path, value);
				else fs.unlink(storage_path);
		} catch(e) {
			console.log("Write error: "+ storage_path);
			err = 1;
		}
		if(err) try { fs.mkdir(storage_path); }catch(e) {}
	}
};
