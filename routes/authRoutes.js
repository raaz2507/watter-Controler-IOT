const express = require("express");

const router = express.Router();

const auth = require("../controllers/authController");

const isAuth = require("../middleware/authMiddleware");

// const appPage =  require("../controllers/appControllers");

router.post("/signup", auth.signup);

router.post("/login", auth.login);

router.get("/logout", auth.logout);

router.get("/user", auth.user);

// current user data
router.get("/profile-data", isAuth, auth.profileData);

// update profile
router.post("/update-profile", isAuth, auth.updateProfile);

module.exports = router;
