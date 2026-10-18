const mongoose = require('mongoose');

const fragranceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, default: "Eau de Parfum" },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.8 },
    image: { type: String, required: true },
    gender: { type: String, default: "Unisex" },
    fragranceType: { type: String, default: "Fresh" }, // e.g., "Floral", "Woody", "Fresh", "Oriental", "Fruity"
    category: { type: String, default: "Luxury" },
    inStock: { type: Boolean, default: true }
});

const Fragrance = mongoose.model('Fragrance', fragranceSchema);

module.exports = Fragrance;
