const db =  require("./db");

db.serialize(() => {
	db.run(`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			username TEXT UNIQUE,
			password TEXT)`);
});

module.exports=db;