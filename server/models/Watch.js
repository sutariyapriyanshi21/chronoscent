const mongoose = require('mongoose');

// 1. Define the Schema (The Blueprint)
const watchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, default: "" },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    image: { type: String, required: true },
    gender: { type: String, default: "Unisex" }, // e.g., "Men", "Women", "Unisex"
    watchType: { type: String, default: "Classic" }, // e.g., "Automatic", "Chronograph", "Diver", "Sport", "Dress"
    category: { type: String, default: "Luxury" },
    inStock: { type: Boolean, default: true }
});

// 2. Create the Model
const Watch = mongoose.model('Watch', watchSchema);

// 3. Export it so other files can use it
module.exports = Watch;
