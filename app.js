const express = require('express');
const app = express();
const port = 3000;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const mongoose = require('mongoose');
const Listing=require("./models/listing.js")

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
app.post("/listings",async(req,res)=>{
  let{title,description,image,price,location,country}=req.body;
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
})



//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const listItem= await Listing.findById(id);
  res.render("listings/edit.ejs",{listItem})
})

//update route
app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  let{title,description,image,price,location,country}=req.body;
  await Listing.findByIdAndUpdate(id,{
    title:title,
    description:description,
    image:image,
    price:price,
    location:location,
    country:country
  })
  res.redirect("/listings");
})


//show route
app.get("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  const listItem= await Listing.findById(id);
  res.render("listings/show.ejs",{listItem});
})

//delete route
app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
