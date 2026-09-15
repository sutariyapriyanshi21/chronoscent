const mongoose = require('mongoose');

const fragranceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    gender: { type: String },
    fragranceType: { type: String } // e.g., "Eau de Parfum", "Eau de Toilette"
});

const Fragrance = mongoose.model('Fragrance', fragranceSchema);

module.exports = Fragrance;
