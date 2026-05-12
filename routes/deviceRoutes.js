const express = require("express");

const router= express.Router();

const device= require( "../controllers/deviceController" );


router.get( "/motorSwitch", device.toggleMotor);

router.get("/autoMationSwitch", device.toggleAutomation);

router.get("/system-status", device.getSystemStatus );

// router.post("/api/system-status", device.updateSystemStatus );


module.exports=router;