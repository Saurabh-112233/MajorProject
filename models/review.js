const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    
    rating:{
        type:Number,
        min:1,
        max:5,
        // required:true
    },
    createdAt:
    {
        type:Date,
        default:Date.now(),
        // required:true
    },
    comments:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Review",reviewSchema)