let mongoose = require('mongoose');
let User = require('./Users');
let Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat_app');

let FriendsSchema = new Schema({
	_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Friend', FriendsSchema);