const jwt = require("jsonwebtoken");
const Message = require("../utils/messageFramework");

exports.getMessages = (req, res) => {

	try {
		console.log("========== MESSAGES ==========");
		console.log("cookies:", req.cookies);

		const token = req.cookies.token;
		// console.log("token:", token);

		let user = null;		

		// agar token hai tabhi verify karo
		if (token) {
			user = jwt.verify( token, process.env.JWT_SECRET);
		}

		// guest user
		if (!user) {
			return res.json({ success: true, user: null, messages: [ { type: "info", message: [] } ] });
		}

		// logged in user
		res.json({ success: true, user, messages: [ { type: "success", message: "Welcome Back" } ]});

	} catch (err) {
		console.log("MESSAGE ROUTE ERROR:");
		console.log(err);

		res.status(500).json({ success: false, message: "Server Error" });
	}
};