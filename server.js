require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const path = require("path");

const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const appRoutes= require("./routes/appRoutes");


const app = express();

const port = 3000;



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

console.log("JWT:", process.env.JWT_SECRET);


// static folder
app.use(express.static(path.join(__dirname, "data")));


// routes load
app.use("/",authRoutes);
app.use("/", deviceRoutes );
app.use( "/", appRoutes );

app.listen(port, () => {
	console.log(`Running \nhttp://localhost:${port}/`);
});



// insert data

const db = require("./models/db");

db.get(
	"SELECT COUNT(*) as count FROM tank_data WHERE user_id=? AND tank_name=?",
	[1, "Tank 1"],
	(err, row) => {

		if (err) {
			console.log("DB Error:", err);
			return;
		}

		// 👉 अगर data नहीं है तभी insert करो
		if (row.count === 0) {

			console.log("Inserting test data...");

			for (let i = 0; i < 24; i++) {
				db.run(
					"INSERT INTO tank_data (user_id, tank_name, hour, value) VALUES (?, ?, ?, ?)",
					[1, "Tank 1", i, Math.floor(Math.random() * 100)]
				);
			}

		} else {
			console.log("Data already exists, skipping insert ✅");
		}
	}
);
for (let i = 0; i < 24; i++) {
	db.run(
		"INSERT INTO tank_data (user_id, tank_name, hour, value) VALUES (?, ?, ?, ?)",
		[1, "Tank 1", i, Math.floor(Math.random() * 100)]
	);
}