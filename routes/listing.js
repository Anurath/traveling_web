const express = require('express');
const router = express.Router();
// const User=require("./user.js")

router.use(express.urlencoded({extended:true}));
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");
const listingController=require("../controller/listing.js");
const {isLoggedIn}=require("../middleware.js");

const multer  = require('multer')
const {storage}=require("../cloudanyConfig.js");
const upload = multer({storage});


//demo status
router.get("/secure",isLoggedIn,(req,res,next)=>{
  res.send("I am secured page.");
});


//index route
router.get("/",listingController.index)
  
  //new route
  router.get("/new",isLoggedIn,listingController.newFormRoute)
  
  //create route
  router.post("/",isLoggedIn,upload.single('image'),listingController.createListing);

  
  //edit route
  router.get("/:id/edit",isLoggedIn,listingController.editFormRenderRoute);
  
  //update route
  router.put("/:id", isLoggedIn,upload.single('image'),listingController.updateListingRoute);
  
  
  //show route
  router.get("/:id",listingController.showRoute);

  
  //delete route
  router.delete("/:id",isLoggedIn,listingController.destroyRoute)


  module.exports=router;