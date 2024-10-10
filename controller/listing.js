const Listing=require("../models/listing");
const ExpressError=require("../utils/ExpressError");
module.exports.index= async(req,res)=>{
    const listings=await Listing.find();
    res.render("listings/index.ejs",{listings});
  };

module.exports.newFormRoute= (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing=async(req,res,next)=>{
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

      let url=req.file.path;
      let filename=req.file.filename;

    let newlist= new Listing({
      title:title,
      description:description,
      image:{
        url:url,
        filename:filename
      },
      price:price,
      location:location,
      country:country
    });
    newlist.owner=req.user._id;
    console.log(newlist.owner);
    await newlist.save();
    req.flash("success","New listing added successfully!");
    res.redirect("/listings");
    }catch(err){
      next(new ExpressError(400,"Validation Error"));
    }
  };

  module.exports.editFormRenderRoute=async(req,res)=>{
    let {id}=req.params;
    const listItem= await Listing.findById(id);
    if(!listItem){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listItem})
  };

  module.exports.updateListingRoute=async (req, res, next) => {
    try {
      let { id } = req.params;
      let { title, description, image, price, location, country } = req.body;
  
      // Find the listing first before checking fields
      let listing = await Listing.findById(id);
  
      // Permission check - Make sure the current user is the owner
      if (listing.owner && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listings/${id}`);
      }
  
      // Validate input fields
      if (!description) {
        throw new ExpressError(400, "Description is missing!");
      }
      if (!title) {
        throw new ExpressError(400, "Title is missing!");
      }
      if (!price) {
        throw new ExpressError(400, "Price is missing!");
      }
      if (!location) {
        throw new ExpressError(400, "Location is missing!");
      }
      if (!country) {
        throw new ExpressError(400, "Country is missing!");
      }
  
      // Update the listing if everything is valid
     let updateListing= await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
      });

      
      if(typeof req.file !== "undefined"){
        let url=req.file.path;
      let filename=req.file.filename;
      
      updateListing.image={url,filename};
      await updateListing.save();
      }

  
      req.flash("success", "Listing updated successfully!");
      res.redirect("/listings");
      
    } catch (err) {
      if (err instanceof ExpressError) {
        next(err);
      } else {
        next(new ExpressError(400, "Please enter valid data for the listing!"));
      }
    }
  };

module.exports.showRoute=async(req,res,next)=>{
    try{
      let {id}=req.params;
    const listItem= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listItem){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    const location1 = listItem.location;
    const country1 = listItem.country;

    res.render("listings/show.ejs",{listItem,location1,country1});
    }catch(err){
        next(new ExpressError(404,"Ivalid Search!"));
    }
  };

module.exports.destroyRoute= async(req,res,next)=>{
    try{
      let {id}=req.params;
      // Find the listing first before checking fields
      let listing = await Listing.findById(id);
  
      // Permission check - Make sure the current user is the owner
      if (listing.owner && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete this listing.");
        return res.redirect(`/listings/${id}`);
      }
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted successfully!");
    res.redirect("/listings");
    }catch(err){
      next(new ExpressError(500,"Intern server error"));
    }
  };

