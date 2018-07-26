const Records = require('../models/Records');
const Users = require('../models/Users');

exports.mess = function (req, res, next) {
	let friendName = req.body.username;
	let username = req.decoded.name;
	let mess = req.body.mess;

	console.log(mess,friendName,username);
	Users.findOne({username: friendName}, function (err, friend) {
		if (err) return next(err);

		if (friend) {
			Users.findOne({username: username}, function (err, user) {
				if (err) return next(err);

				let id = user._id > friend._id ? user._id + '-' + friend._id : friend._id + '-' + user._id;
				let flag = user._id > friend._id ? "1" : "0";

				let message = flag + mess + flag;   // 如果前后一样表示另一方未读

				Records.findOne({_id: id}, function (err, record) {
					if (err) return next(err);

					if (mess) {
						if(record) {    // 如果聊天记录以前记录过
							Records.update({_id: id}, {$push: {mess: message}}, function (err) {
								if (err) return next(err);
							});

							record.mess.push(message);
							console.log(record.mess);

							res.send({records: record.mess, flag: flag});

						} else {
							Records.create({
								_id: id,
								mess: message,
							});

							res.send({records: [message], flag: flag})
						}
					} else {
						if(record) {

							res.send({records: record.mess, flag: flag})

						} else {

							res.send({records: [], flag: flag})

						}
					}
				})
			})
		}
	})

};