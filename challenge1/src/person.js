const util = require('util');

class Person {
	constructor() {
		this.name = null;
		this.age = null;
		this.username = null;
	}

	summary() {
		return util.format('Your name is %s, you are %d and your username is %s', this.name, this.age, this.username);
	}
}

module.exports = Person;