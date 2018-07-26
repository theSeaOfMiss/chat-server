const jwt = require('jsonwebtoken');
const token = require('../token');
const secret = token.secret; //撒盐：加密的时候混淆

exports.auth = function (req, res, next) {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		// 解码 token (验证 secret 和检查有效期（exp）)
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'token已失效，请重新登入！' });
			} else {
				// 如果验证通过，在req中写入解密结果
				req.decoded = decoded;
				// console.log(decoded)  ;
				next(); //继续下一步路由
			}
		});
	} else {
		// 没有拿到token 返回错误
		return res.status(403).send({
			success: false,
			message: '警告，警告。'
		});
	}
};
