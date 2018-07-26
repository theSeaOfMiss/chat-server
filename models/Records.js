let mongoose = require('mongoose');
let Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat_app');

let RecordsSchema = new Schema({
	_id: {type: String, required: true},
	mess: [{type: String}],
});

module.exports = mongoose.model('Record', RecordsSchema);