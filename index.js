const express = require("express")
const app = express();
const mongoose = require("mongoose")
const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const path = require("path")
var methodOverride = require('method-override')
var ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError")
const listings = require("./routes/listing")
const reviews = require("./routes/review")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/User.js")
const userRouter = require("./routes/users.js")

const sessionOptions = {secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    Cookie: {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}



app.use(methodOverride('_method'))
app.set("views engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', ejsMate);
app.use(express.json())
app.use(express.urlencoded({extended:true}));
main().then(console.log("connected")).catch(err=>console.log(err))
async function main(){
    await mongoose.connect(mongoUrl)
}
app.use(express.static(path.join(__dirname,"public")))


// reviews
app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})

app.use("/listings/:id/reviews",reviews);
app.use("/listings",listings);
app.use("/",userRouter)

app.get("/",(req,res)=>{
    res.redirect("/listings")
})
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"))
})

app.use((err,req,res,next)=>{
    let {statusCode =500,message="Something went wrong"} = err
    res.status(statusCode).render("listings/error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server started")
})