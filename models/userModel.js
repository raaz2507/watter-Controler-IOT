const db =  require("./db");

db.serialize(() => {
	 // users table
	db.run(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		username TEXT UNIQUE,
		password TEXT)`);

	// 👉 chart data table
	db.run(`CREATE TABLE IF NOT EXISTS tank_data (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER,
		tank_name TEXT,
		hour INTEGER,
		value INTEGER,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	)`);
	
	db.run(`CREATE TABLE IF NOT EXISTS tank_settings (

			id INTEGER PRIMARY KEY AUTOINCREMENT,

			user_id INTEGER UNIQUE,

			tankType TEXT,

			measuringUnit TEXT,

			height REAL,

			width REAL,

			length REAL,

			dimeater REAL
		)`);
	db.run(`CREATE TABLE IF NOT EXISTS automation_settings(

		id INTEGER PRIMARY KEY AUTOINCREMENT,

		user_id INTEGER UNIQUE,

		automationEnabled INTEGER DEFAULT 0,
		
		minRange INTEGER,
		maxRange INTEGER,

		startTime TEXT,

		startDateTime TEXT,

		weekdays TEXT,

		lowWaterCutoff INTEGER
	)`);


});



module.exports=db;