const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();

const port = 3000;

const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// static folder
app.use(express.static(path.join(__dirname, "data")));

let users = [];
app.post("/signup", async (req, res) => {
	const { username, password } = req.body;

	const hash = await bcrypt.hash(password, 10);

	users.push({
		username,
		password: hash,
	});

	res.json({ message: "Signup success" });
});

app.post("/login", async (req, res) => {

	const username = (req.body.username || "").trim();
	const password = (req.body.password || "").trim();

	// 1. validation first
	if (!username || !password) {
		return res.json({ error: "Missing fields" });
	}

	// 2. user exist check
	const user = users.find(u => u.username === username);
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
	res.json({ success: true, redirect: "/dashbord.html" });
});


app.get("/logout", (req, res) => {
	req.session.destroy();
	res.json({ message: "Logged out" });
});


function isAuth(req, res, next) {
  if (!req.session.user) {
    return res.json({ message: "Not logged in" });
  }
  next();
}








app.get("/api/state", (req, res) => {
	res.json({
		status: "ok",
		temp: 27,
	});
});

app.get("/toggle", (req, res) => {
	const state = req.query.state;

	console.log("Switch:", state);

	res.json({
		received: state,
	});
});

app.listen(port, () => {
	console.log(`Running \nhttp://localhost:${port}/`);
});
