const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
        url : String,
        filename: String,
    },
    price: { type: Number, required: true }, 
    location : String,
    country : String,
    reviews : [ 
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    category : {
        type : String,
       
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
        
});

const Listing = mongoose.model("Listing",listingSchema);//creates the model of listing which as the schema of listingSchema
module.exports = Listing;