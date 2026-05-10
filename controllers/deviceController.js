
const mState =  false;
exports.toggleMotor = (req,res)=>{

	const state= req.query.state; 
	console.log( "Motor State:", state);

	res.json({ state:mState });
};

const autoMswt =  true;
exports.toggleAutomation = (req, res) =>{
	const state = req.query.state;
	console.log("Automation State: ", state);
	res.json({state:autoMswt});
};



exports.toggleAutoMode = (req, res)=>{

	const state =  req.query.state;
	console.log("Auto mode:", state);
};

let systemStatus = {

	battery: 0,

	wifi: 0,

	deviceStatus: "Offline",

	lastUpdate: null
};

exports.updateSystemStatus = (req,res)=>{
	const { battery, wifi, deviceStatus } = req.body;

	systemStatus = {battery, wifi, deviceStatus, lastUpdate: Date.now()};

	console.log(systemStatus);

	res.json({success:true});
};

exports.getSystemStatus = (req,res)=>{

	// auto offline check

	const now = Date.now();

	const diff = now - (systemStatus.lastUpdate || 0);

	// 15 sec no update
	if(diff > 15000){
		systemStatus.deviceStatus =
		"Offline";
	}


	res.json({ success:true, data: systemStatus });
};