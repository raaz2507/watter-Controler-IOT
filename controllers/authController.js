const db = require("../models/userModel");
// const db= require("../models/db");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const bcrypt = require("bcryptjs");

const Message = require("../utils/messageFramework");

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
	db.run( `INSERT INTO users (name, username,password) VALUES (?,?, ?)`, [name, username, hash], function (err) {
			console.log(err);
			if (err) {
				Message.error( username, "User Exists...");
				return res.json({ error: "User exists" });
			}
			console.log("sussess account created");

			Message.success(username, "Signup success");

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
		Message.warning( username, "Missing fields");
		return res.json({ error: "Missing fields" });
	}

	// 2. user exist check
	// const user = users.find((u) => u.username === username);
	// if (!user) {
	// 	return res.json({ error: "User not found" });
	// }
	db.get(
		`SELECT * FROM users WHERE username=?`, [username],
		async function (err, user) {
			if (!user) {
				Message.error( username, "User not found");
				return res.json({ error: "User not found" });
			}

			const match = await bcrypt.compare(password, user.password);

			if (!match) {
				Message.error( username, "Wrong Password");
				return res.json({ error: "Wrong password" });
			}

			// 👉 JWT token बनाओ
			const token = jwt.sign(
				{ userId: user.id, username: user.username },
				process.env.JWT_SECRET,
				{ expiresIn: "1d" },
			);
			console.log("LOGIN SUCCESS, TOKEN:", token);

			// 👉 cookie में set
			res.cookie("token", token, {
				httpOnly: true,
				secure: false, // production में true
				maxAge: 1000 * 60 * 60 * 24,
			});

			Message.success(username, "Login success");
			res.json({ success: true, token: token, redirect: "/dashboard", message: "Login success", });
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

exports.user = function (req, res){
	const token = req.cookies.token;
	console.log(token);

	if (!token) {
		Message.warning( username, "Logout Sussesfuly");
		return res.json({ loggedIn: false });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		res.json({ loggedIn: true, userId: decoded.userId, username: decoded.username, });
	} catch (err) {
		Message.error( username, "Login Failed");
		return res.json({ loggedIn: false });
	}
};

// logout
exports.logout = (req, res) => {
	console.log("logout");
	res.clearCookie("token");

	Message.success(req.userId, "Logout Successfully");
	res.json({ success: true, redirect: "/" });
};

// current user data
exports.profileData = (req, res) => {
	db.get(
		`SELECT id,name,username FROM users WHERE id=?`,
		[req.userId],

		(err, user) => {
			if (err) {
				Message.error( username, "DB Error");

				return res.json({ success: false, message: "DB Error", });
			}

			if (!user) {
				Message.error( username, "User not found...");

				return res.json({ success: false, message: "User not found", });
			}

			res.json({ success: true, user, });
		},
	);
};

// update profile
exports.updateProfile = async (req, res) => {
	const name = req.body.name.trim();
	const username = req.body.username.trim();
	const password = req.body.password.trim();

	if (!name || !username) {
		Message.warning( username, "Empty Fields...");
		return res.json({ success: false,message: "Empty fields", });
	}

	try {
		// password change nahi kiya
		if (!password) {
			db.run( `UPDATE users SET name=?, username=? WHERE id=?`, [name, username, req.userId], function (err){
					if (err) {
						Message.error( username, "Username Already Exists..");
						return res.json({ success: false,message: "Username already exists",});
					}
					Message.success( username, "Profile Updated...");
					
					res.json({ success: true, message: "Profile Updated", });
				},
			);
		} else {
			// password bhi update
			const hash = await bcrypt.hash(password, 10);

			db.run(`UPDATE users SET name=?, username=?, password=? WHERE id=?`, [name, username, hash, req.userId],

				function (err) {
					if (err) {
						Message.error( username, "Username Already Exists..");
						
						return res.json({ success: false, message: "Username already exists", });
					}

					res.json({ success: true, message: "Profile Updated", });
				},
			);
		}
	} catch (err) {
		console.log(err);
		Message.error( username, "Server Error");
		res.json({ success: false, message: "Server Error", });
	}
};
