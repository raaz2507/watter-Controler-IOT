const db = require("../models/userModel");


// GET tank data
exports.getTankData = (req,res)=>{

	db.get(

		`SELECT * FROM tank_settings
		 WHERE user_id=?`,

		[req.userId],

		(err,row)=>{

			if(err){

				return res.json({
					success:false,
					message:"DB Error"
				});
			}

			res.json({
				success:true,
				tank: row || null
			});
		}
	);
};




// UPDATE tank
exports.updateTank = (req,res)=>{

	const {
		tankType,
		measuringUnit,
		height,
		width,
		length,
		dimeater
	} = req.body;


	db.get(

		`SELECT * FROM tank_settings
		 WHERE user_id=?`,

		[req.userId],

		(err,row)=>{

			if(row){

				// UPDATE

				db.run(

					`UPDATE tank_settings SET

					tankType=?,
					measuringUnit=?,
					height=?,
					width=?,
					length=?,
					dimeater=?

					WHERE user_id=?`,

					[
						tankType,
						measuringUnit,
						height,
						width,
						length,
						dimeater,
						req.userId
					],

					function(err){

						if(err){

							return res.json({
								success:false,
								message:"Update Failed"
							});
						}

						res.json({
							success:true,
							message:"Tank Updated"
						});
					}
				);

			}else{

				// INSERT

				db.run(

					`INSERT INTO tank_settings(

						user_id,
						tankType,
						measuringUnit,
						height,
						width,
						length,
						dimeater

					) VALUES(?,?,?,?,?,?,?)`,

					[
						req.userId,
						tankType,
						measuringUnit,
						height,
						width,
						length,
						dimeater
					],

					function(err){

						if(err){

							return res.json({
								success:false,
								message:"Insert Failed"
							});
						}

						res.json({
							success:true,
							message:"Tank Saved"
						});
					}
				);
			}
		}
	);
};