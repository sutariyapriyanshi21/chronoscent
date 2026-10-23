const mongoose = require('mongoose');

// Brand Blueprint
const brandSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    categoryType: { 
        type: String, 
        enum: ['watches', 'fragrances', 'both'], 
        default: 'both' 
    },
    origin: { 
        type: String, 
        default: 'International' 
    },
    description: { 
        type: String, 
        default: '' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
