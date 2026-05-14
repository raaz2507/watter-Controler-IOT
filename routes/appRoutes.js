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
router.get("/todayChart", isAuth, charts.todayChart);
router.get("/weekChart", isAuth, charts.weekChart);
router.get("/yearChart", isAuth, charts.yearChart);

const tankController = require("../controllers/tankController");

router.get("/tank-data", isAuth, tankController.getTankData);

router.post("/update-tank", isAuth, tankController.updateTank);

const automationController = require("../controllers/automationController");

router.get("/automation-data", isAuth, automationController.getAutomationData);

router.post( "/update-automation", isAuth, automationController.updateAutomation);

const message = require("../controllers/messageController");
router.get("/messages", message.getMessages);
module.exports = router;
