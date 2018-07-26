var Users = require('../models/Users');

exports.submit = function (req, res, next) {
	console.log(req.body);
	var name = req.body.username;
	var pass = req.body.password;

	var messageObj = {
		message: ''
	};

	if(name && pass) {
		Users.findOne({username: name}, function (err, user) {
			if (err) return next(err);    // 顺序传递数据库连接错误和其他错误
			if (user) {   // 用户名已经被占用
				messageObj.message = '用户名已经存在！';
				res.send(messageObj);
			} else {
				Users.create({
					username: name,
					password: pass
				}, function (err, user) {
					if (err) return next(err);
					messageObj.message = '注册成功！';
					res.send(messageObj);
				});
			}
		});
	} else {
		messageObj.message = '请填写完整信息！';
		res.send(messageObj);
	}
};
