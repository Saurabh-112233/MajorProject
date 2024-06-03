const mongoose = require("mongoose")
const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("../models/listing")
const sampleListings = require("./data")
main().then(console.log("connected")).catch(err=>console.log(err))
async function main(){
    await mongoose.connect(mongoUrl)
}

async function initDB(){
        await Listing.deleteMany({});
        sampleListings.data = sampleListings.data.map((obj)=>({...obj,owner:'662c93e8fd188febbe7ba64b'}))
        Listing.insertMany(sampleListings.data).then(console.log("success"));
}

initDB();