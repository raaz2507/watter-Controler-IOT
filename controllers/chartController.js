const db = require("../models/userModel");

exports.dayChart = (req, res) => {
	console.log("get Chart data");
	const userId = req.userId;

	db.all(
		"SELECT hour, value FROM tank_data WHERE user_id=? ORDER BY hour",
		[userId],
		(err, rows) => {

			if (err) return res.json({ error: err });
			console.log("DB rows:", rows);
			// 👉 24 hours array बनाओ
			let data = new Array(24).fill(0);

			rows.forEach(r => {
				data[r.hour] = r.value;
			});

			res.json({
				tank1: data
			});
		}
	);
};