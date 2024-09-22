const express = require('express');
const app = express();
const port = 3000;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/reviews.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const { nextTick } = require('process');

main().then((res)=>{
  console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}


app.get("/",(req,res)=>{
  res.send("Hi I am root.");
})

//index route
app.get("/listings",async(req,res)=>{
  const listings=await Listing.find();
  res.render("listings/index.ejs",{listings});
})

//new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
})

//create route
app.post("/listings",async(req,res,next)=>{
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
  res.redirect("/listings");
  }catch(err){
    next(new ExpressError(400,"Validation Error"));
  }
});



//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const listItem= await Listing.findById(id);
  res.render("listings/edit.ejs",{listItem})
});

//update route
app.put("/listings/:id",async(req,res,next)=>{
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
  })
  res.redirect("/listings");
  }catch(err){
    next(new ExpressError(400,"Please enter the valid data for listing!"));
  }
})


//show route
app.get("/listings/:id",async(req,res,next)=>{
  try{
    let {id}=req.params;
  const listItem= await Listing.findById(id);
  res.render("listings/show.ejs",{listItem});
  }catch(err){
      next(new ExpressError(404,"Ivalid Search!"));
  }
})

//delete route
app.delete("/listings/:id",async(req,res,next)=>{
  try{
    let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
  }catch(err){
    next(new ExpressError(500,"Intern server error"));
  }
})



app.post("/listings/:id/reviews",async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  listing.reviews.push(newReview);

  let res_review=await newReview.save();
  let res_list=await listing.save();

  console.log(res_review);
  console.log(res_list);

  res.send("Data Saved Successfully.");
})

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})


app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong."}=err;
  res.render("error.ejs",{err});
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});








//if error occure in future then remove if statments from the above apis