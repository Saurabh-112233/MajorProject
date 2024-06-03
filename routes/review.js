const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/WrapAsync")
const Review = require("../models/review")
const Listing = require("../models/listing")
const {reviewValidate,isLoggedIn,isReviewAuthor} = require("../middleware")


router.post("/",isLoggedIn,reviewValidate,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview)

    await newReview.save()
    await listing.save()
    req.flash("success","Review created successfully")
    res.redirect(`/listings/${listing._id}`)
}))
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${id}`);
}))
module.exports = router;