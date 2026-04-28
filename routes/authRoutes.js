const express = require("express");

const router = express.Router();

const auth = require("../controllers/authController");

const isAuth = require("../middleware/authMiddleware");

router.post("/signup", auth.signup);

router.post("/login", auth.login);

router.get("/logout", auth.logout);

// protected
router.get("/dashboard-data", isAuth, (req, res) => {
	res.json({ user: req.session.user });
});

const path = require("path");

router.get("/dashboard", isAuth,(req, res) => {
		res.sendFile(path.join(__dirname, "..", "data/private", "dashbord.html"));
},);


module.exports = router;
