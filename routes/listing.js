const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync")
const Listing = require("../models/listing")
const listingController = require("../controller/listings.js")
const {isLoggedIn, isOwner,listingValidate} = require("../middleware.js")


router.get("/",wrapAsync(listingController.index))

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","listing doesn't exists")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}))



router.post("/",isLoggedIn,listingValidate,wrapAsync(async(req,res,next)=>{
       
        let listing = req.body.listing;
        let listing1 = new Listing({
        title:listing.title,
        description:listing.description,
        image:listing.image,
        price:listing.price,
        location:listing.location,
        country:listing.country,
        owner:req.user._id
    })
            
    await listing1.save();
    req.flash("success","listing created successfully")
    res.redirect("/listings")
    
    
}))

router.get("/:id/edit",isOwner,isLoggedIn,async(req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","listing doesn't exists")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing})
})

router.patch("/:id",isOwner,listingValidate,async(req,res)=>{
    let {id} = req.params;
    let newListing = req.body.listing;
    let listing = await Listing.findByIdAndUpdate(id,{title:newListing.title,description:newListing.description,
        image:newListing.image,price:newListing.price,location:newListing.location,country:newListing.country
    });
   res.redirect("/listings")
})

router.delete("/:id",isOwner,isLoggedIn,async(req,res)=>{
    let {id} = req.params;
   let data= await Listing.findByIdAndDelete(id)
   req.flash("success","listing deleted successfully")
    res.redirect("/listings")
})

module.exports = router;