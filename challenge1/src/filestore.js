const fs = require('fs');
const util = require('util');

class Filestore {
	constructor(path) {
		this.file = path;
	}

	insert(record) {
		let text = util.format("Name %s, Age %d, Username %s\n\r", record.name, record.age, record.username);
		fs.appendFile(this.file, text, (err) => {
			if(err) throw err;
		});
	}
}

module.exports = Filestore;