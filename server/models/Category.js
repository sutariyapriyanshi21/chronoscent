const mongoose = require('mongoose');

// Category Tier Blueprint
const categorySchema = new mongoose.Schema({
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
    description: { 
        type: String, 
        default: '' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
