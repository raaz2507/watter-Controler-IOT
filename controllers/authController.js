const users = require("../models/userModel");

const fs = require("fs");
const bcrypt = require("bcryptjs");

// signup
exports.signup = async (req, res) => {
	const { username, password } = req.body;

	let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

	if (users.find((u) => u.username === username)) {
		return res.json({
			error: "User exists",
		});
	}

	const hash = await bcrypt.hash(password, 10);

	users.push({
		username,
		password: hash,
	});

	fs.writeFileSync("users.json", JSON.stringify(users, null, 2), );

	console.log(users);

	res.json({ message: "Signup success" });
};

// login
exports.login = async (req, res) => {
	console.log(`reqBody ${req.body}`);

	const username = (req.body.username || "").trim();
	const password = (req.body.password || "").trim();

	// 1. validation first
	if (!username || !password) {
		return res.json({ error: "Missing fields" });
	}

	// 2. user exist check
	const user = users.find((u) => u.username === username);
	if (!user) {
		return res.json({ error: "User not found" });
	}

	// 3. password compare
	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		return res.json({ message: "Wrong password" });
	}

	// session create
	req.session.user = username;

	// res.json({ message: "Login success" });
	// redirect instruction
	res.json({ success: true, redirect: "/dashboard" });
};

// logout
exports.logout = (req, res) => {
	req.session.destroy();
	res.json({ message: "Logged out" });
};
