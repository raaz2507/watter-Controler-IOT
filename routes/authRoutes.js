const express = require("express");

const router = express.Router();

const auth = require("../controllers/authController");

const isAuth = require("../middleware/authMiddleware");

// const appPage =  require("../controllers/appControllers");

router.post("/signup", auth.signup);

router.post("/login", auth.login);

router.get("/logout", auth.logout);

router.get("/user", auth.user);


module.exports = router;
