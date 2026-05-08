const express= require("express");
const router = express.Router();

const appPages =  require("../controllers/appControllers");
const charts = require("../controllers/chartController");

const isAuth = require("../middleware/authMiddleware");

router.get("/dashboard", isAuth ,appPages.dashboard);

router.get("/charts", isAuth, appPages.charts);
router.get("/about", appPages.about);

router.get ("/profileSetup", appPages.profileSetup);
// router.get( "/test", (req,res)=>{
// 	res.send("route working");
// });
router.get("/chart", isAuth, charts.dayChart);


const tankController = require("../controllers/tankController");

router.get("/tank-data", isAuth, tankController.getTankData);

router.post("/update-tank", isAuth, tankController.updateTank);

const automationController = require("../controllers/automationController");

router.get("/automation-data", isAuth, automationController.getAutomationData);

router.post( "/update-automation", isAuth, automationController.updateAutomation);


module.exports = router;
