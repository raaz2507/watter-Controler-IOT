const db = require("../models/userModel");

exports.todayChart = (req, res) => {
	console.log("get day chart data");
	const userId = req.userId;

	// db.all(
	// 	"SELECT hour, value FROM tank_data WHERE user_id=? ORDER BY hour",
	// 	[userId],
	// 	(err, rows) => {

	// 		if (err) return res.json({ error: err });
	// 		console.log("DB rows:", rows);
	// 		// 👉 24 hours array बनाओ
	// 		let data = new Array(24).fill(0);

	// 		rows.forEach(r => {
	// 			data[r.hour] = r.value;
	// 		});

	// 		res.json({
	// 			tank1: data
	// 		});
	// 	}
	// );
	const data = [ 12, 18, 25, 30, 42, 50, 65, 70, 68, 72, 80, 85, 90, 88, 84, 78, 69, 60, 55, 48, 40, 32, 24, 15 ];
	
	res.json({ tank1: data });
};

exports.weekChart = (req, res) => {
	const userId =req.userId;
	const data =[ 12, 30, 40, 50, 60, 45, 35];
	res.json({ tank1: data });
}

exports.yearChart = (req, res) => {
	const userId =req.userId;
	const data =[ 12, 18, 25, 30, 42, 50, 65, 70, 68, 72, 80, 85];
	res.json({ tank1: data });
}

// let data =  Array(60).fill(0);
// exports.liveChart = (req, res)=>{
// 	console.log("get live Chart Data");
// 	const userId = req.userId;

// 	// new random value
// 	const newValue = Math.floor(Math.random() * 100);
// 	data.shift(); //left shift
// 	data.push(newValue);
// 	res.json({ tank1: data})
// }