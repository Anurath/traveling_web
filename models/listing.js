const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default:"https://unsplash.com/photos/a-beach-with-boats-and-people-tnatdes93Aw",
        set: (v) => v === "" ? "https://unsplash.com/photos/a-beach-with-boats-and-people-tnatdes93Aw" : v,
    },
    price:Number,
    location:String,
    country:String
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;