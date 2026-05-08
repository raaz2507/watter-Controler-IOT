const jwt = require("jsonwebtoken");

function isAuth(req, res, next) {

	// 🟢 1. Cookie से token (browser auto भेजेगा)
	let token = req.cookies?.token;

	// 🔵 2. अगर cookie में नहीं मिला → header check करो (API / ESP32)
	if (!token) {
		token = req.headers.authorization;
	}

	console.log("TOKEN:", token); // 🔍 debug

	// ❌ token ही नहीं है
	if (!token) {

		// API call है?
		if (req.path.startsWith("/api") || req.headers.authorization) {
			return res.status(401).json({ message: "No token" });
		}

		// Browser page
		return res.redirect("/");
	}

	// 🔐 Verify JWT
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		req.userId = decoded.userId;
		req.username = decoded.username;

		next();

	} catch (err) {

		console.log("JWT ERROR:", err.message);

		if (req.path.startsWith("/api")) {
			return res.status(401).json({ message: "Invalid token" });
		}

		return res.redirect("/");
	}
}

module.exports = isAuth;