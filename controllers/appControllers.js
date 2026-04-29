const path = require("path");



exports.dashboard = (req, res) => {
	console.log("dashboard hit");
	res.sendFile(path.join(__dirname, "..", "data/private", "dashboard.html"));
};

exports.charts =  (req, res) =>{
	res.sendFile(path.join (__dirname, ".." ,"data/private","charts.html"))
};


exports.about = (req, res) =>{
	res.sendFile( path.join (__dirname, "..", "data", "about.html"));
}


// forms

exports.profileSetup = (req, res)=>{
	res.sendFile(path.join(__dirname, "..", "data", "profileSetup.html"));
}