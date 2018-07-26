const Users = require('../models/Users');
const Friends = require('../models/Friends');

// 添加朋友
exports.add = function (req, res, next) {
	let friendName = req.body.username;
	let username = req.decoded.name;
	let flag = 0;

	if(friendName === username) {
		res.send({message: '不能添加自己为好友！'});
		return;
	}

	Users.findOne({ username: friendName }, function (err, friend) {
		if (err) return next(err);

		if (friend) {   // 表示好友用户存在
			Users.findOne({ username: username }, function (err, user) {
				if (err) return next(err);

				if(user) {
					Friends.findOne({ _id: user._id }).populate('friends').exec(function (err, link) {
						if (err) return next(err);

						if(link) {    // 如果表过去已经建立

							let list = [];    // 好友名单的数组
							link.friends.forEach(function (currentValue) {
								if(JSON.stringify(currentValue._id) === JSON.stringify(friend._id)) {
									flag = 1;
								}
								list.push(currentValue.username)
							});
							// 如果flag为1，则表示，好友曾经添加过
							if (flag) {
								res.send({message: '该好友已经添加！'});
								return;
							}

							// 更新表单
							Friends.update({_id: user._id}, {$push: {friends: friend._id}}, function (err) {
								if (err) return next(err);
							});

							list.push(friendName);

							res.send({message: '添加成功！', friends: list});


						} else {    // 如果表过去没有建立，则建立一个新表
							Friends.create({
								_id: user._id,
								friends: [friend._id]
							});

							res.send({message: '添加成功！', friends: [friendName]});
						}
					})
				}
			})
		} else {    // 表示好友用户不存在
			res.send({message: '该用户不存在！'});
		}
	});
};

exports.search = function (req, res, next) {
	let username = req.decoded.name;

	Users.findOne({username: username}, function (err, user) {
		if (err) return next(err);

		Friends.findOne({_id: user._id}).populate('friends').exec(function (err, link) {
			if (err) return next(err);

			if(link) {

				let list = [];
				link.friends.forEach(function (currentValue) {
					list.push(currentValue.username);
				});

				res.send({friends: list});
			} else {
				res.send({friends: []});
			}
		});
	})
};

