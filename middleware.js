const Listing = require("./models/listing");
const Review = require("./models/review")
const ExpressError = require("./utils/ExpressError")
const {listingSchema,reviewSchema} = require("./Schema")
module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You! must be logged in first!")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let newListing = await Listing.findById(id);
    if(!newListing.owner.equals(res.locals.currUser._id))
    {
        req.flash("error","You are not the owner")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.listingValidate = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error)
        throw new ExpressError(400,error)
    else
        next()
}

module.exports.reviewValidate = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body)
    if(error)
        throw new ExpressError(400,error)
    else
        next()
}
