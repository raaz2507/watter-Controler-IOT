exports.state= (req,res)=>{ 
	res.json({ temp:27, status:"ok" });
};

exports.toggle = (req,res)=>{

	const state= req.query.state; 
	console.log( "Switch:", state);

	res.json({ received:state });
};