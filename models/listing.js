const mongoose = require("mongoose");
const Review = require("./review")
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://th.bing.com/th/id/OIP.wwxK07x0Umfnh0l-nrjxjgHaDg?w=324&h=166&c=7&r=0&o=5&dpr=1.3&pid=1.7",
        set:(v)=> v === ""?"https://th.bing.com/th/id/OIP.wwxK07x0Umfnh0l-nrjxjgHaDg?w=324&h=166&c=7&r=0&o=5&dpr=1.3&pid=1.7":v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
       }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        await Review.deleteMany({_id:{$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing

