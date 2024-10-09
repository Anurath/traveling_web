const User=require("../models/user.js");

module.exports.signupFormRoute=(req,res,next)=>{
    console.log(req.originalUrl);
    try{
        res.render("users/signup.ejs");
    }catch(err){
        next(new ExpressError(400,err));
    }
};

module.exports.createSignupUser= async(req,res,next)=>{
    try{
        let {username,password,email}=req.body;
    const newUser=new User({
        email,
        username,
    });
    let registerUser=await User.register(newUser,password);
    req.logIn(registerUser,(err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Welcome to WonderLust")
        res.redirect("/listings");
    })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.loginFormRoute=(req,res,next)=>{
    res.render("./users/login.ejs");
};

module.exports.createLoginRoute= async(req,res,next)=>{
    try{
        // let {username,password}=req.body;
        // req.flash("success","Welcome Back to WonderLust");
        // console.log(res.locals.redirectUrl)
        // res.redirect(res.locals.redirectUrl);
        req.flash("success","Welcome to wonderlust! You are logged in.");
        let isredirectUrl=res.locals.redirectUrl;
        if(isredirectUrl){
            res.redirect(isredirectUrl);
        }else{
            res.redirect("/listings");
        }
    }catch(e){
        next(new ExpressError(400,e))
    }
};

module.exports.logoutRoute=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};