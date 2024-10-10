if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require('express');
const app = express();
const port = 3000;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError");
const Review=require("./models/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const dbUrl='mongodb+srv://waghmodeanurath:gt1C1YWAtniD8sR9@cluster0.tgcwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE!");
})


const sessionObject={
  store,
  secret:"mysuperSecreteCode",
  resave:false,
  saveUninitialized:true,
  Cookie:{
    expires:Date.now()+10000,
    maxAge:10000,
    httpOnly:true
  }
}




app.use(session(sessionObject));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"anurathwaghmode@gmail.com",
    username:"anurath",
  });
  let registeredUser=await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const listingsRouter=require("./routes/listing.js");
app.use("/listings",listingsRouter);

const reviewsRouter=require("./routes/review.js");
app.use("/listings/:id/reviews",reviewsRouter);

const userRouter=require("./routes/user.js");
app.use("/",userRouter)



const mongoose = require('mongoose');
const Listing=require("./models/listing.js");
const { nextTick } = require('process');

main().then((res)=>{
  console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl,{
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if cannot connect
    socketTimeoutMS: 45000,         // Timeout after 45 seconds for socket operations
  });
}


app.get("/",(req,res)=>{
  res.redirect("/listings");
})

app.get("/searchlist",async(req,res,next)=>{
    try{
      let {search,select}=req.query;
    if(select){
      let listings = await Listing.find({ country:select});
      if(listings.length<=0){
        req.flash("error", "Match not found please try again!");
        return  res.redirect("/listings");
      }
      return res.render("listings/search.ejs",{listings});
    }
    else if(search){
      console.log(search);
      let lowercase=search.toLowerCase();
      let newSearchStr=lowercase.charAt(0).toUpperCase() + lowercase.slice(1)
      let listings = await Listing.find({location:newSearchStr});
      if(listings.length<=0){
        req.flash("error", "Match not found please try again!");
        return  res.redirect("/listings");
      }
      return res.render("listings/search.ejs",{listings});
    }
    else{
      req.flash("error", "Match not found please try again!");
      return res.redirect("/listings");
    }
    }catch(err){
      next(new ExpressError(400,"Something went wrong!"));
    }

});


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"You can try refreshing... or buy some popcorn and wait!"));
})


app.use((err,req,res,next)=>{
  let {status=500,message="Something went wrong."}=err;
  res.render("error.ejs",{err});
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

//if error occure in future then remove if statments from the above apis