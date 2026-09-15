const mongoose = require('mongoose');

// 1. Define the Schema (The Blueprint)
const watchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    gender: { type: String }, // e.g., "Men", "Women"
    watchType: { type: String } // e.g., "Automatic", "Chronograph"
});

// 2. Create the Model
const Watch = mongoose.model('Watch', watchSchema);

// 3. Export it so other files can use it
module.exports = Watch;
