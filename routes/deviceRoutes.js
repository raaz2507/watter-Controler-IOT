const express = require("express");

const router= express.Router();

const device= require( "../controllers/deviceController" );

router.get( "/api/state", device.state);

router.get( "/toggle", device.toggle);

module.exports=router;