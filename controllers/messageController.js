const jwt = require("jsonwebtoken");
const Message = require("../utils/messageFramework");

exports.getMessages = (req, res) => {

	try {

		console.log("========== MESSAGES ==========");

		console.log("cookies:", req.cookies);

		const token = req.cookies.token;

		console.log("token:", token);

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET
		);

		console.log("decoded:", decoded);

		const messages =
			Message.getMessages(decoded.username);

		console.log("messages:", messages);

		res.json({
			success: true,
			messages
		});

	} catch (err) {

		console.log("MESSAGE ROUTE ERROR:");
		console.log(err);

		res.json({
			success: false,
			messages: []
		});
	}
};