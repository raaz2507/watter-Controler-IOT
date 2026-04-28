function isAuth(req,res,next){

	if(!req.session.user){
		return res.json({ message:"Not logged in" });
	}
	next();
}

module.exports=isAuth;