const express = require("express")
const router = express.Router({mergeParams:true});
const User = require("../models/User");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware");
const { json } = require("stream/consumers");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",WrapAsync(async(req,res)=>{
    // console.log("djks")
    try {
        let {username,password,email} = req.body;
        const newUser = new User({email,username})
     // console.log("body",req.body)
        // let {username,password,email} = req.body;

        // res.json({data:req.body})
        let registeredUser = await User.register(newUser,password)
        // console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err)
                return next(err);
            req.flash("success","Welcome to wanderlust")
            res.redirect("/listings")
        })
        
    } catch (e) {
        console.log(e)
        req.flash("error",e.message)
        res.redirect("/signup")
    }
    
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome! You are logged in Wanderlust!!")
     let redirectUrl = res.locals.redirectUrl || "/listings";
     console.log(redirectUrl)
     res.redirect(redirectUrl)
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err)
           return next(err);
    });
    req.flash("success","You have been logged out!!")
    res.redirect("/listings")
})

module.exports = router;