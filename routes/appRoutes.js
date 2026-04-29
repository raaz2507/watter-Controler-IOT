const express= require("express");
const router = express.Router();

const appPages =  require("../controllers/appControllers");

const isAuth = require("../middleware/authMiddleware");

router.get("/dashboard", isAuth ,appPages.dashboard);

router.get("/charts", isAuth, appPages.charts);
router.get("/about", appPages.about);

router.get ("/profileSetup", appPages.profileSetup);
// router.get( "/test", (req,res)=>{
// 	res.send("route working");
// });

module.exports = router;

// router.get(
// "/dashboard",
// isAuth,
// appPages.dashboard
// );