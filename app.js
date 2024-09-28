const express = require('express');
const app = express();
const port = 3000;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/reviews.js");
const session=require("express-session");
const flash=require("connect-flash");

const sessionObject={
  secret:"mysuperSecreteCode",
  resave:false,
  saveUninitialized:true,
  Cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}
app.use(session(sessionObject));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const listings=require("./routes/listing.js");
app.use("/listings",listings);

const reviews=require("./routes/review.js");
app.use("/listings/:id/reviews",reviews);

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