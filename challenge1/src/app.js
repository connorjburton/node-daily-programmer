const Person = require('./person');
const Filestore = require('./filestore');
const readline = require('readline');
const util = require('util');
 
class App {
	constructor() {
		this.filestore = new Filestore('../storage/records.txt');
		this.person = new Person();
		this.asks = null;
		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}

	get firstQuestion() {
		// always gets the first question in the queue
		return Object.entries(this.asks)[0];
	}

	askFor(properties) {
		this.asks = properties;
		this.watchRl(() => {
			// callback once we have asked all questions
			console.log(this.person.summary());
			this.filestore.insert(this.person);
		});

		// asks first question and kicks off queue
		this.question(this.firstQuestion[0], this.firstQuestion[1]);
	}

	watchRl(complete) {
		this.rl.on('pause', () => {
			// if there aren't any questions left to ask, give us person summary
			if(!Object.keys(this.asks).length) {
				complete();
			} else {
				// otherwise ask the next question
				this.question(this.firstQuestion[0], this.firstQuestion[1])
			}
		});
	}

	question(name, type) {
		this.rl.question(util.format("What is your %s? ", name), (result) => {
			//if the user has entered incorrect data ask them for it again
			if(this.determineType(result) !== type || !result.trim().length) {
				console.log(util.format('Please enter a valid value for %s', name));
				this.question(arguments[0], arguments[1]);
			} else {
				// if user enters the correct data, remove first question so the next can be asked
				// add data to the user object and pause the readline input so the even callback fires
				this.removeFirstQuestion();
				this.person[name] = (type === 'number') ? parseInt(result) : result;
				this.rl.pause();
			}
		});
	}

	removeFirstQuestion() {
		// credit https://github.com/tc39/proposal-object-values-entries/issues/15
		// converts to object to array, slices first question off, converts back to object. no built in method currently
		this.asks = Object.entries(this.asks).slice(1).map(([key, val]) => ([key, val])).reduce((obj, [k, v]) => Object.assign(obj, { [k]: v }), {});
	}

	determineType(value) {
		// all inputs come in as `string` so we can't just do `typeof`
		return (isNaN(parseInt(value))) ? 'string' : 'number';
	}
}

let app = new App();
app.askFor({
	name: 'string',
	age: 'number',
	username: 'string'
});