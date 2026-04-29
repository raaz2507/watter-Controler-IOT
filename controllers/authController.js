const db = require("../models/userModel");
// const db= require("../models/db");

const fs = require("fs");
const bcrypt = require("bcryptjs");

// signup
exports.signup = async (req, res) => {
	// const {name, username, password } = req.body;
	console.log(`reqBody ${req.body}`);

	const name = req.body.name.trim();
	const username = req.body.username.trim();
	const password = req.body.password.trim();

	// let users = JSON.parse(fs.readFileSync("users.json", "utf8"));

	// if (users.find((u) => u.username === username)) {
	// 	return res.json({
	// 		error: "User exists",
	// 	});
	// }
	const hash = await bcrypt.hash(password, 10);

	if (!name || !username || !password) {
		res.json({ success: false, message: "Empty Fild not alowed" });
	}
	db.run(
		`INSERT INTO users (name, username,password) VALUES (?,?, ?)`,
		[name, username, hash],

		function (err) {
			console.log(err);
			if (err) {
				return res.json({ error: "User exists" });
			}
			console.log("sussess account created");
			res.json({ success: true, redirect: "/", message: "Signup success" });
		},
	);

	db.all(`SELECT * FROM users`, async (err, rows) => {
		if (err) {
			console.log(err);
			return;
		}
		rows.forEach((row) => {
			console.log(row);
		});
	});

	// users.push({ username, password: hash, });

	// fs.writeFileSync("users.json", JSON.stringify(users, null, 2), );

	// console.log(users);

	// res.json({ message: "Signup success" });
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
	// const user = users.find((u) => u.username === username);
	// if (!user) {
	// 	return res.json({ error: "User not found" });
	// }
	db.get(
		`SELECT * FROM users WHERE username=?`,
		[username],
		async (err, user) => {
			if (!user) {
				return res.json({ error: "User not found" });
			}

			const match = await bcrypt.compare(password, user.password);

			if (!match) {
				return res.json({ error: "Wrong password" });
			}

			req.session.user = user.username;

			res.json({
				success: true,
				redirect: "/dashboard",
				message: "Login success",
			});
		},
	);

	// // 3. password compare
	// const match = await bcrypt.compare(password, user.password);

	// if (!match) {
	// 	return res.json({ message: "Wrong password" });
	// }

	// // session create
	// req.session.user = username;

	// // res.json({ message: "Login success" });
	// // redirect instruction
	// res.json({ success: true, redirect: "/dashboard" });
};

exports.user = (req, res) => {
	if (!req.session.user) {
		return res.json({ loggedIn: false });
	}

	res.json({
		loggedIn: true,
		name: req.session.name,
		username: req.session.user,
	});
};

// logout
exports.logout = (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.json({ success: false, message: "Logout failed", });
		}
		res.json({ success: true, redirect: "/", message: "Logged out", });
	});
};
