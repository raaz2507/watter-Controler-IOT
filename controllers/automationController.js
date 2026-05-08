const db = require("../models/userModel");



// GET
exports.getAutomationData = (req,res)=>{

	db.get(

		`SELECT * FROM automation_settings
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
				data: row || null
			});
		}
	);
};




// UPDATE / INSERT
exports.updateAutomation = (req,res)=>{

	const {
		minRange,
		maxRange,
		startTime,
		startDateTime,
		weekdays,
		lowWaterCutoff
	} = req.body;


	db.get(

		`SELECT * FROM automation_settings
		 WHERE user_id=?`,

		[req.userId],

		(err,row)=>{

			if(row){

				// UPDATE

				db.run(

					`UPDATE automation_settings SET

					minRange=?,
					maxRange=?,
					startTime=?,
					startDateTime=?,
					weekdays=?,
					lowWaterCutoff=?

					WHERE user_id=?`,

					[
						minRange,
						maxRange,
						startTime,
						startDateTime,
						weekdays,
						lowWaterCutoff,
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
							message:"Automation Updated"
						});
					}
				);

			}else{

				// INSERT

				db.run(

					`INSERT INTO automation_settings(

						user_id,
						minRange,
						maxRange,
						startTime,
						startDateTime,
						weekdays,
						lowWaterCutoff

					) VALUES(?,?,?,?,?,?,?)`,

					[
						req.userId,
						minRange,
						maxRange,
						startTime,
						startDateTime,
						weekdays,
						lowWaterCutoff
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
							message:"Automation Saved"
						});
					}
				);
			}
		}
	);
};

exports.getAutomationData = (req,res)=>{

	db.get(

		`SELECT * FROM automation_settings
		 WHERE user_id=?`,

		[req.userId],

		(err,row)=>{

			if(err){

				return res.json({
					success:false
				});
			}

			res.json({
				success:true,
				data: row || null
			});
		}
	);
};