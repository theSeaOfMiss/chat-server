const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const token = require('../lib/token');
const secret = token.secret; //撒盐：加密的时候混淆




exports.submit = function (req, res, next) {
	let name = req.body.username;
	let pass = req.body.password;

	let messageObj = {
		message: '',
		token: ''
	};

	Users.findOne({ username: name }, function (err, user) {
		if (err) return next(err);

		if (user) {   // 表示用户存在
			user.comparePassword(pass, function (err, isMatch) {    // 比较密码
				if (err) throw err;

				if (isMatch) {    // 如果密码匹配

					const token = jwt.sign({
						name: name,
						pass: pass,
					}, secret, {
						expiresIn:  '1h' //秒到期时间
					});

					messageObj.token = token;
					res.send(messageObj);
				} else {    // 如果密码不匹配
					messageObj.message = '密码错误';
					res.send(messageObj);
				}
			});
		} else {    // 表示该用户不存在
			messageObj.message = '该用户不存在';
			res.send(messageObj);
		}
	});
};

// exports.logout = function (req, res) {    // 推出session
// 	req.session.destroy(function (err) {
// 		if (err) throw err;
// 		res.redirect('/')
// 	});
// };