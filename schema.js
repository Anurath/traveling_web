const  Jio=require("joi");
const Listing = require("./models/listing");
const { json } = require("express");

module.exports.listingSchema=Jio.object({
    Listing:Jio.object({
        title:Jio.string().required(),
        description:Jio.string().required(),
        location:Jio.string().required(),
        country:Jio.string().required(),
        price:Jio.number().required().min(0),
        image:Jio.string().allow("",null),
    }).required(),
});

module.exports.reviewSchema({
    review:Jio.number({
        rating:Jio.number().required().min(1).max(5),
        comment:Jio.string().required(),
    }).required(),
})