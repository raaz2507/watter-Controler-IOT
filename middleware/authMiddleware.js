function isAuth(req, res, next) {
	if (!req.session.user) {
		if (req.path.startsWith("/api")) {
			return res.json({success: false, message: "Not logged in",});
		}

		return res.redirect("/");
	}

	next();
}

module.exports=isAuth;



