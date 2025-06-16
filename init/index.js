const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Ghar";
main().then(()=>{
    console.log("Connection Successful!");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

// const initDB = async () => {
//     await Listing.deleteMany({}); // <-- Clears existing data first
//     initData.data = initData.data.map((obj) => ({
//         ...obj,
//         owner: "680a65524501bfe1efacd484"
//     }));
//     await Listing.insertMany(initData.data);
//     console.log("Data was initialized.");
// };

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "680a65524501bfe1efacd484",
        image: obj.image  // ONLY the url string, not an object
    }));
    await Listing.insertMany(initData.data);
    console.log("Database seeded successfully with updated image field.");
};


initDB();
