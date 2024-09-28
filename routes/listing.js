const express = require('express');
const router = express.Router();


router.use(express.urlencoded({extended:true}));
const ExpressError=require("../utils/ExpressError");
const Listing=require("../models/listing.js");




//index route
router.get("/",async(req,res)=>{
    const listings=await Listing.find();
    res.render("listings/index.ejs",{listings});
  })
  
  //new route
  router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
  })
  
  //create route
  router.post("/", async(req,res,next)=>{
    try{
      let{title,description,image,price,location,country}=req.body;
      if(!description){
        throw new ExpressError(400,"Desciption is missing!");
      }
      if(!title){
        throw new ExpressError(400,"Title is missing!");
      }
      if(!price){
        throw new ExpressError(400,"Price is missing!");
      }
      if(!location){
        throw new ExpressError(400,"Location is missing!");
      }
      if(!country){
        throw new ExpressError(400,"Country is missing!");
      }
    let newlist= new Listing({
      title:title,
      description:description,
      image:image,
      price:price,
      location:location,
      country:country
    });
    await newlist.save();
    req.flash("success","New listing added successfully!");
    res.redirect("/listings");
    }catch(err){
      next(new ExpressError(400,"Validation Error"));
    }
  });
  
  
  
  //edit route
  router.get("/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listItem= await Listing.findById(id);
    if(!listItem){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listItem})
  });
  
  //update route
  router.put("/:id",async(req,res,next)=>{
    try{
      let {id}=req.params;
    let{title,description,image,price,location,country}=req.body;
    if(!description){
      throw new ExpressError(400,"Desciption is missing!");
    }
    if(!title){
      throw new ExpressError(400,"Title is missing!");
    }
    if(!price){
      throw new ExpressError(400,"Price is missing!");
    }
    if(!location){
      throw new ExpressError(400,"Location is missing!");
    }
    if(!country){
      throw new ExpressError(400,"Country is missing!");
    }
    await Listing.findByIdAndUpdate(id,{
      title:title,
      description:description,
      image:image,
      price:price,
      location:location,
      country:country
    });
    req.flash("success","Listing updated Successfully!");
    res.redirect("/listings");
    }catch(err){
      next(new ExpressError(400,"Please enter the valid data for listing!"));
    }
  })
  
  
  //show route
  router.get("/:id",async(req,res,next)=>{
    try{
      let {id}=req.params;
    const listItem= await Listing.findById(id).populate("reviews");
    if(!listItem){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listItem});
    }catch(err){
        next(new ExpressError(404,"Ivalid Search!"));
    }
  })
  
  //delete route
  router.delete("/:id",async(req,res,next)=>{
    try{
      let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted successfully!");
    res.redirect("/listings");
    }catch(err){
      next(new ExpressError(500,"Intern server error"));
    }
  })

  module.exports=router;