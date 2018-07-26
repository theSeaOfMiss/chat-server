var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://localhost/chat_app');

var UserSchema = new Schema({
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
//	friends: {type: Array, ref: 'User', required: false}
});

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) return next();    // 只在新密码或密码重制时hash密码

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {    // 生成盐
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {    // 哈希密码
			if (err) return next(err);

			user.password = hash;   // 用hash值代替密码
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);