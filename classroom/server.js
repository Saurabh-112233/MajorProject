const express = require("express")
const app= express();
const session = require("express-session")
const path = require("path")
const flash = require("connect-flash")

app.set("views engine","ejs")
app.set("views",path.join(__dirname,"views"));
const sessionOptions = {secret:"mysupersecretstring",
resave:false,
saveUninitialized:true}

app.use(session(sessionOptions))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.errorMsg = req.flash("error")
    res.locals.successMsg = req.flash("success")
    next()
})
app.get("/register",(req,res)=>{
    let {name = "Saurabh"} = req.query;
    req.session.name = name;
    console.log(`${req.session.name}`)
    if(req.session.name === "Saurabh")
        req.flash("error","user not registered")
    else
        req.flash("success","user registered successfully")
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name})
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else
//         req.session.count =1;
//     res.send(`You have accessed ${req.session.count} times`)
// })

app.use("/",(req,res)=>{
    res.send("welcome")
})
app.listen(3000,()=>{
    console.log("server started")
})