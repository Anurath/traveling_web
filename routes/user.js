const express = require('express');
const router = express.Router();
const User=require("../models/user.js");
const ExpressError=require("../utils/ExpressError");
const passport = require('passport');
const {saveRedirectUrl,isReviewAuthor}=require("../middleware.js");
const userController=require("../controller/users.js");
//signup page
router.get("/signup",userController.signupFormRoute);

//adding user to db signUp page
router.post("/signup",userController.createSignupUser);

//login get route
router.get("/login",userController.loginFormRoute);

//login post route
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.createLoginRoute);

router.get("/logout",userController.logoutRoute)

module.exports=router;