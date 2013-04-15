var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Creative = new Schema({
	name		: String,
	email		: String,
	img 		: String,
	url			: String,
    tags        : [String],
	created_at	: Date
});

mongoose.model('Creative', Creative);

//mongoose.connect(process.env.CONNSTRING);
