const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import our models
const Watch = require('./models/Watch');
const Fragrance = require('./models/Fragerence');
const Order = require('./models/Order');
const User = require('./models/User'); // Added User model for authentication
const Brand = require('./models/Brand'); // Dynamic Brand House model
const Category = require('./models/Category'); // Dynamic Category Tier model
const Message = require('./models/Message'); // Contact & Concierge messages

const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Serve public static assets
app.use('/assests', express.static(path.join(__dirname, '../client/public/assests')));

// Auto-seed baseline brands & categories if empty
const seedBaselineBrandsAndCategories = async () => {
    try {
        const brandCount = await Brand.countDocuments();
        if (brandCount === 0) {
            const defaultBrands = [
                { name: "Rolex", categoryType: "watches", origin: "Switzerland", description: "Icon of horological prestige and precision" },
                { name: "Omega", categoryType: "watches", origin: "Switzerland", description: "Pioneering timepieces with space & marine heritage" },
                { name: "Cartier", categoryType: "both", origin: "France", description: "The jeweler of kings and king of jewelers" },
                { name: "Tissot", categoryType: "watches", origin: "Switzerland", description: "Innovators by tradition since 1853" },
                { name: "Seiko", categoryType: "watches", origin: "Japan", description: "Japanese craftsmanship and technical perfection" },
                { name: "Chanel", categoryType: "fragrances", origin: "France", description: "Timeless Parisian haute parfumerie" },
                { name: "Creed", categoryType: "fragrances", origin: "France", description: "Seven generations of royal niche artisanal fragrances" },
                { name: "Versace", categoryType: "fragrances", origin: "Italy", description: "Bold, sensual Milanese luxury perfumes" },
                { name: "Dior", categoryType: "fragrances", origin: "France", description: "Haute couture elegance and refined French scents" },
                { name: "Tom Ford", categoryType: "fragrances", origin: "United States", description: "Private blend modern glamour and sensual sophistication" }
            ];
            await Brand.insertMany(defaultBrands);
            console.log('Seeded default luxury brands into MongoDB.');
        }

        const catCount = await Category.countDocuments();
        if (catCount === 0) {
            const defaultCategories = [
                { name: "Luxury", categoryType: "both", description: "Top-tier flagship timepieces and prestige parfums" },
                { name: "Premium", categoryType: "both", description: "High-spec craftsmanship and elevated editions" },
                { name: "Classic", categoryType: "both", description: "Timeless heritage designs and vintage appeal" },
                { name: "Standard", categoryType: "both", description: "Accessible luxury for refined daily lifestyle" },
                { name: "Niche", categoryType: "fragrances", description: "Artisanal, rare formulation perfume houses" },
                { name: "Designer", categoryType: "fragrances", description: "Celebrated runway couture fragrance lines" },
                { name: "Private Blend", categoryType: "fragrances", description: "Exclusive small-batch high perfumery creations" }
            ];
            await Category.insertMany(defaultCategories);
            console.log('Seeded default catalog categories into MongoDB.');
        }
    } catch (err) {
        console.error('Error auto-seeding brands/categories:', err);
    }
};

// Auto-seed default watches & fragrances if empty
const seedBaselineProducts = async () => {
    try {
        const watchCount = await Watch.countDocuments();
        if (watchCount === 0) {
            const watchData = [
                { name: "Submariner Date", brand: "Rolex", model: "126610LN", price: 1050000, rating: 4.9, image: "/assests/Products/Watches/rolex-submariner.jpg", category: "Luxury", gender: "Men", watchType: "Diver", inStock: true },
                { name: "Lady-Datejust", brand: "Rolex", model: "279173", price: 825000, rating: 4.8, image: "/assests/Products/Watches/Lady-Datejust.jpg", category: "Luxury", gender: "Women", watchType: "Classic", inStock: true },
                { name: "Seamaster Diver 300M", brand: "Omega", model: "210.30.42.20.03.001", price: 525000, rating: 4.8, image: "/assests/Products/Watches/omega-seamaster.jpg", category: "Luxury", gender: "Men", watchType: "Diver", inStock: true },
                { name: "Panthère de Cartier", brand: "Cartier", model: "WSPN0012", price: 660000, rating: 4.8, image: "/assests/Products/Watches/Cartier Panthère de Cartier.jpg", category: "Luxury", gender: "Women", watchType: "Dress", inStock: true },
                { name: "Lovely Square", brand: "Tissot", model: "T058.109.11.031.00", price: 38500, rating: 4.7, image: "/assests/Products/Watches/Tissot Lovely Square.jpg", category: "Premium", gender: "Women", watchType: "Classic", inStock: true },
                { name: "Prospex Diver", brand: "Seiko", model: "SPB143", price: 105000, rating: 4.7, image: "/assests/Products/Watches/seiko-prospex.jpg", category: "Premium", gender: "Men", watchType: "Sport", inStock: true },
                { name: "Asymmetrical Vintage", brand: "Seiko", model: "Custom Vintage", price: 29500, rating: 4.5, image: "/assests/Products/Watches/Assymentrical seiko.jpg", category: "Standard", gender: "Unisex", watchType: "Classic", inStock: true },
                { name: "Baignoire", brand: "Cartier", model: "W8000008", price: 975000, rating: 4.9, image: "/assests/Products/Watches/Cartier Baignoire.jpg", category: "Luxury", gender: "Women", watchType: "Classic", inStock: true },
                { name: "Drive de Cartier", brand: "Cartier", model: "WSNM0004", price: 540000, rating: 4.8, image: "/assests/Products/Watches/Cartier Draive De Cartier.jpg", category: "Luxury", gender: "Men", watchType: "Classic", inStock: true },
                { name: "Constellation Pluma", brand: "Omega", model: "123.20.27.60.55.007", price: 440000, rating: 4.9, image: "/assests/Products/Watches/Omega Constellation Pluma.jpg", category: "Luxury", gender: "Women", watchType: "Classic", inStock: true },
                { name: "Oyster Perpetual Datejust", brand: "Rolex", model: "126234", price: 725000, rating: 4.9, image: "/assests/Products/Watches/Rolex Oyster Perpetual Datejust.jpg", category: "Luxury", gender: "Unisex", watchType: "Classic", inStock: true },
                { name: "Constellation", brand: "Omega", model: "131.10.39.20.01.001", price: 515000, rating: 4.8, image: "/assests/Products/Watches/The Omega Constellation.jpg", category: "Luxury", gender: "Men", watchType: "Classic", inStock: true },
                { name: "Classic Dream", brand: "Tissot", model: "T129.410.16.013.00", price: 21500, rating: 4.6, image: "/assests/Products/Watches/Tissot Classic Dream.jpg", category: "Standard", gender: "Men", watchType: "Classic", inStock: true },
                { name: "Classic", brand: "Seiko", model: "SUR371", price: 16500, rating: 4.5, image: "/assests/Products/Watches/seiko.jpg", category: "Standard", gender: "Unisex", watchType: "Classic", inStock: true },
                { name: "Vintage Must de Cartier", brand: "Cartier", model: "Vintage", price: 155000, rating: 4.7, image: "/assests/Products/Watches/vintage cartier.jpg", category: "Luxury", gender: "Unisex", watchType: "Classic", inStock: true }
            ];
            await Watch.insertMany(watchData);
            console.log('Auto-seeded default luxury watches into MongoDB.');
        }

        const fragranceCount = await Fragrance.countDocuments();
        if (fragranceCount === 0) {
            const fragranceData = [
                { name: "Chance", brand: "Chanel", model: "Eau de Parfum", price: 11500, rating: 4.8, image: "/assests/Products/Fregerances/Chanel Chance.jpg", category: "Luxury", gender: "Women", fragranceType: "Floral", inStock: true },
                { name: "Pour Monsieur", brand: "Chanel", model: "Eau de Toilette", price: 10200, rating: 4.7, image: "/assests/Products/Fregerances/Chanel Pour Monsieur.jpg", category: "Classic", gender: "Men", fragranceType: "Woody", inStock: true },
                { name: "Aventus", brand: "Creed", model: "Eau de Parfum", price: 31000, rating: 4.9, image: "/assests/Products/Fregerances/Creed Aventus.jpg", category: "Niche", gender: "Men", fragranceType: "Fresh", inStock: true },
                { name: "Queen of Silk", brand: "Creed", model: "Eau de Parfum", price: 34000, rating: 4.8, image: "/assests/Products/Fregerances/Creed Queen of Silk.jpg", category: "Niche", gender: "Women", fragranceType: "Oriental", inStock: true },
                { name: "Carmina", brand: "Creed", model: "Eau de Parfum", price: 36000, rating: 4.9, image: "/assests/Products/Fregerances/Creed-carmina.jpg", category: "Niche", gender: "Women", fragranceType: "Floral", inStock: true },
                { name: "Crystal Noir", brand: "Versace", model: "Eau de Parfum", price: 9500, rating: 4.6, image: "/assests/Products/Fregerances/Crystal Noir Luxury_unisex.jpg", category: "Designer", gender: "Unisex", fragranceType: "Oriental", inStock: true },
                { name: "Dior Homme", brand: "Dior", model: "Eau de Toilette", price: 9800, rating: 4.7, image: "/assests/Products/Fregerances/Dior Homme_unisex.jpg", category: "Designer", gender: "Unisex", fragranceType: "Woody", inStock: true },
                { name: "Sauvage", brand: "Dior", model: "Eau de Parfum", price: 12500, rating: 4.9, image: "/assests/Products/Fregerances/Dior Sauvage.jpg", category: "Designer", gender: "Men", fragranceType: "Fresh", inStock: true },
                { name: "Eau Fraiche", brand: "Versace", model: "Eau de Toilette", price: 7800, rating: 4.5, image: "/assests/Products/Fregerances/EAU Fraiche_varsache_men.jpg", category: "Designer", gender: "Men", fragranceType: "Fresh", inStock: true },
                { name: "Gabrielle", brand: "Chanel", model: "Eau de Parfum", price: 13500, rating: 4.8, image: "/assests/Products/Fregerances/Gebrielle Chanel.jpg", category: "Luxury", gender: "Women", fragranceType: "Floral", inStock: true },
                { name: "Gris Dior", brand: "Dior", model: "Eau de Parfum", price: 28000, rating: 4.9, image: "/assests/Products/Fregerances/Gris Dior_ Unisex Eau de Parfum.jpg", category: "Private Blend", gender: "Unisex", fragranceType: "Woody", inStock: true },
                { name: "Miss Dior", brand: "Dior", model: "Eau de Parfum", price: 11500, rating: 4.7, image: "/assests/Products/Fregerances/Miss Dior.jpg", category: "Designer", gender: "Women", fragranceType: "Floral", inStock: true },
                { name: "Santal Blush", brand: "Tom Ford", model: "Eau de Parfum", price: 25000, rating: 4.8, image: "/assests/Products/Fregerances/TomFord Santal Blush.jpg", category: "Private Blend", gender: "Unisex", fragranceType: "Woody", inStock: true },
                { name: "Lost Cherry", brand: "Tom Ford", model: "Eau de Parfum", price: 33500, rating: 4.9, image: "/assests/Products/Fregerances/TomFord_Lost Cherry.jpg", category: "Private Blend", gender: "Unisex", fragranceType: "Fruity", inStock: true },
                { name: "Bright Crystal", brand: "Versace", model: "Eau de Toilette", price: 8200, rating: 4.6, image: "/assests/Products/Fregerances/Versace-Bright Crystal.jpg", category: "Designer", gender: "Women", fragranceType: "Fruity", inStock: true },
                { name: "Eros Pour Femme", brand: "Versace", model: "Eau de Parfum", price: 10500, rating: 4.7, image: "/assests/Products/Fregerances/varsace Eros pour Femme.jpg", category: "Designer", gender: "Women", fragranceType: "Woody", inStock: true }
            ];
            await Fragrance.insertMany(fragranceData);
            console.log('Auto-seeded default luxury fragrances into MongoDB.');
        }
    } catch (err) {
        console.error('Error auto-seeding products:', err);
    }
};

// Connect to local MongoDB Compass
mongoose.connect('mongodb://127.0.0.1:27017/chronoscent')
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        seedBaselineBrandsAndCategories();
        seedBaselineProducts();
    })
    .catch((error) => console.error('MongoDB connection error:', error));

// ==========================================
// API ROUTES (The "Menu" for our frontend)
// ==========================================

// Route 1: Get all watches
app.get('/api/watches', async (req, res) => {
    try {
        const watches = await Watch.find();
        res.json(watches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching watches" });
    }
});

// Get single watch
app.get('/api/watches/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Watch not found" });
        }
        const watch = await Watch.findById(req.params.id);
        if (!watch) {
            return res.status(404).json({ message: "Watch not found" });
        }
        res.json(watch);
    } catch (error) {
        res.status(500).json({ message: "Error fetching watch details" });
    }
});

// Admin: Create a new watch
app.post('/api/watches', async (req, res) => {
    try {
        const watchData = { ...req.body };
        if (!watchData._id || watchData._id === '') {
            delete watchData._id;
        }
        const newWatch = new Watch(watchData);
        await newWatch.save();
        res.status(201).json(newWatch);
    } catch (error) {
        console.error("Error creating watch:", error);
        res.status(500).json({ message: error.message || "Error creating watch", error });
    }
});

// Admin: Update a watch
app.put('/api/watches/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        const updatedWatch = await Watch.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedWatch);
    } catch (error) {
        console.error("Error updating watch:", error);
        res.status(500).json({ message: error.message || "Error updating watch", error });
    }
});

// Admin: Delete a watch
app.delete('/api/watches/:id', async (req, res) => {
    try {
        await Watch.findByIdAndDelete(req.params.id);
        res.json({ message: "Watch deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting watch", error });
    }
});

// Route 2: Get all fragrances
app.get('/api/fragrances', async (req, res) => {
    try {
        const fragrances = await Fragrance.find();
        res.json(fragrances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fragrances" });
    }
});

// Get single fragrance
app.get('/api/fragrances/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Fragrance not found" });
        }
        const fragrance = await Fragrance.findById(req.params.id);
        if (!fragrance) {
            return res.status(404).json({ message: "Fragrance not found" });
        }
        res.json(fragrance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching fragrance details" });
    }
});

// Admin: Create a new fragrance
app.post('/api/fragrances', async (req, res) => {
    try {
        const fragranceData = { ...req.body };
        if (!fragranceData._id || fragranceData._id === '') {
            delete fragranceData._id;
        }
        const newFragrance = new Fragrance(fragranceData);
        await newFragrance.save();
        res.status(201).json(newFragrance);
    } catch (error) {
        console.error("Error creating fragrance:", error);
        res.status(500).json({ message: error.message || "Error creating fragrance", error });
    }
});

// Admin: Update a fragrance
app.put('/api/fragrances/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        const updatedFragrance = await Fragrance.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedFragrance);
    } catch (error) {
        console.error("Error updating fragrance:", error);
        res.status(500).json({ message: error.message || "Error updating fragrance", error });
    }
});

// Admin: Delete a fragrance
app.delete('/api/fragrances/:id', async (req, res) => {
    try {
        await Fragrance.findByIdAndDelete(req.params.id);
        res.json({ message: "Fragrance deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting fragrance", error });
    }
});

// ==========================================
// ORDER ROUTES
// ==========================================

// Create a new order (Checkout)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
});

// Get all orders (Admin Panel)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 }); // Newest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// Get orders for a specific user (Customer "My Orders")
app.get('/api/orders/user/:email', async (req, res) => {
    try {
        const userEmail = req.params.email;
        if (!userEmail) {
            return res.status(400).json({ message: "Email parameter is required" });
        }
        const orders = await Order.find({
            "customerInfo.email": { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') }
        }).sort({ orderDate: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching user orders", error });
    }
});

// Customer: Cancel an order (Allowed only if status is Processing)
app.put('/api/orders/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== "Processing") {
            return res.status(400).json({ message: `Cannot cancel order that is already ${order.status}` });
        }
        order.status = "Cancelled";
        await order.save();
        res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling order", error });
    }
});

// Customer: Submit or edit product review & star rating for a delivered item
app.put('/api/orders/:orderId/review', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { itemIndex, rating, review } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "Delivered") {
            return res.status(400).json({ message: "Reviews can only be submitted for delivered orders." });
        }

        if (!order.orderItems[itemIndex]) {
            return res.status(404).json({ message: "Item not found in order" });
        }

        order.orderItems[itemIndex].rating = Number(rating) || 5;
        order.orderItems[itemIndex].review = review ? review.trim() : "";
        order.orderItems[itemIndex].reviewedAt = new Date();

        await order.save();
        res.json({ message: "Thank you! Your rating and review have been saved.", order });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Failed to submit review", error });
    }
});

// Admin: Update order status (Processing, Shipped, Delivered, Cancelled)
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error });
    }
});

// Admin: Delete an order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});

// ==========================================
// CONTACT & CONCIERGE MESSAGES
// ==========================================

// Create a new message (From Contact Page)
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }
        const newMessage = new Message({
            name,
            email,
            subject: subject || "Customer Inquiry",
            message
        });
        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully!", data: newMessage });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ message: "Failed to send message", error });
    }
});

// Admin: Get all contact messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
});

// Admin: Delete a contact message
app.delete('/api/messages/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting message", error });
    }
});

// ==========================================
// BRAND & CATEGORY DYNAMIC CRUD MANAGEMENT
// ==========================================

// Get all brands (with optional filter by ?type=watches|fragrances)
app.get('/api/brands', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type && type !== 'all') {
            query = { categoryType: { $in: [type, 'both'] } };
        }
        const brands = await Brand.find(query).sort({ name: 1 });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: "Error fetching brands", error });
    }
});

// Admin: Add a new Brand
app.post('/api/brands', async (req, res) => {
    try {
        const { name, categoryType, origin, description } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Brand name is required" });
        }

        // Case-insensitive check
        const existing = await Brand.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ message: `Brand "${name.trim()}" already exists!` });
        }

        const newBrand = new Brand({
            name: name.trim(),
            categoryType: categoryType || 'both',
            origin: origin ? origin.trim() : 'International',
            description: description ? description.trim() : ''
        });
        await newBrand.save();
        res.status(201).json({ message: "Brand created successfully", brand: newBrand });
    } catch (error) {
        res.status(500).json({ message: "Error creating brand", error });
    }
});

// Admin: Update Brand
app.put('/api/brands/:id', async (req, res) => {
    try {
        const { name, categoryType, origin, description } = req.body;
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        const oldName = brand.name;
        const newName = name ? name.trim() : oldName;

        // If renaming brand name, cascade update to watches and fragrances
        if (newName !== oldName) {
            const conflict = await Brand.findOne({ 
                _id: { $ne: brand._id }, 
                name: { $regex: new RegExp(`^${newName}$`, 'i') } 
            });
            if (conflict) {
                return res.status(400).json({ message: `Another brand already uses the name "${newName}"` });
            }
            await Watch.updateMany({ brand: oldName }, { brand: newName });
            await Fragrance.updateMany({ brand: oldName }, { brand: newName });
        }

        brand.name = newName;
        if (categoryType) brand.categoryType = categoryType;
        if (origin !== undefined) brand.origin = origin.trim();
        if (description !== undefined) brand.description = description.trim();

        await brand.save();
        res.json({ message: "Brand updated successfully", brand });
    } catch (error) {
        res.status(500).json({ message: "Error updating brand", error });
    }
});

// Admin: Delete Brand
app.delete('/api/brands/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        await Brand.findByIdAndDelete(req.params.id);
        res.json({ message: `Brand "${brand.name}" removed successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error deleting brand", error });
    }
});

// Get all categories (with optional filter by ?type=watches|fragrances)
app.get('/api/categories', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type && type !== 'all') {
            query = { categoryType: { $in: [type, 'both'] } };
        }
        const categories = await Category.find(query).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
});

// Admin: Add a new Category
app.post('/api/categories', async (req, res) => {
    try {
        const { name, categoryType, description } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ message: `Category "${name.trim()}" already exists!` });
        }

        const newCategory = new Category({
            name: name.trim(),
            categoryType: categoryType || 'both',
            description: description ? description.trim() : ''
        });
        await newCategory.save();
        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error });
    }
});

// Admin: Update Category
app.put('/api/categories/:id', async (req, res) => {
    try {
        const { name, categoryType, description } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const oldName = category.name;
        const newName = name ? name.trim() : oldName;

        if (newName !== oldName) {
            const conflict = await Category.findOne({ 
                _id: { $ne: category._id }, 
                name: { $regex: new RegExp(`^${newName}$`, 'i') } 
            });
            if (conflict) {
                return res.status(400).json({ message: `Another category already uses the name "${newName}"` });
            }
            await Watch.updateMany({ category: oldName }, { category: newName });
            await Fragrance.updateMany({ category: oldName }, { category: newName });
        }

        category.name = newName;
        if (categoryType) category.categoryType = categoryType;
        if (description !== undefined) category.description = description.trim();

        await category.save();
        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
});

// Admin: Delete Category
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: `Category "${category.name}" removed successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    }
});

// Admin: Legacy bulk rename brand across all catalog items
app.put('/api/brands/rename', async (req, res) => {
    try {
        const { oldBrand, newBrand } = req.body;
        if (!oldBrand || !newBrand) {
            return res.status(400).json({ message: "Both oldBrand and newBrand are required" });
        }
        await Watch.updateMany({ brand: oldBrand }, { brand: newBrand });
        await Fragrance.updateMany({ brand: oldBrand }, { brand: newBrand });
        await Brand.findOneAndUpdate({ name: oldBrand }, { name: newBrand });
        res.json({ message: `Successfully updated brand from ${oldBrand} to ${newBrand}` });
    } catch (error) {
        res.status(500).json({ message: "Error updating brand", error });
    }
});

// Admin: Legacy bulk rename category across all catalog items
app.put('/api/categories/rename', async (req, res) => {
    try {
        const { oldCategory, newCategory } = req.body;
        if (!oldCategory || !newCategory) {
            return res.status(400).json({ message: "Both oldCategory and newCategory are required" });
        }
        await Watch.updateMany({ category: oldCategory }, { category: newCategory });
        await Fragrance.updateMany({ category: oldCategory }, { category: newCategory });
        await Category.findOneAndUpdate({ name: oldCategory }, { name: newCategory });
        res.json({ message: `Successfully updated category from ${oldCategory} to ${newCategory}` });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    }
});

// ==========================================
// AUTHENTICATION & USER MANAGEMENT
// ==========================================

// Get all users (For Admin Console - Customers Tab)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ _id: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

// Admin: Toggle User Status (Active or Blocked)
app.put('/api/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body; // 'active' or 'blocked'
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User marked as ${status}`, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user status", error });
    }
});

// Admin: Add a new User / Customer
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({ message: "A user with this email address already exists" });
        }
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password.trim(),
            role: role || "user",
            status: status || "active"
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: error.message || "Error creating user", error });
    }
});

// Admin: Update User details
app.put('/api/users/:id', async (req, res) => {
    try {
        const { name, email, role, status, password } = req.body;
        const updateObj = {};
        if (name) updateObj.name = name.trim();
        if (email) updateObj.email = email.toLowerCase().trim();
        if (role) updateObj.role = role;
        if (status) updateObj.status = status;
        if (password && password.trim()) updateObj.password = password.trim();

        const updated = await User.findByIdAndUpdate(req.params.id, updateObj, { new: true }).select("-password");
        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updated });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: error.message || "Error updating user", error });
    }
});

// Admin: Delete a User
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

// Admin: Delete / Moderate a Customer Review from an Order
app.delete('/api/orders/:orderId/review/:itemIndex', async (req, res) => {
    try {
        const { orderId, itemIndex } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const idx = parseInt(itemIndex, 10);
        if (order.orderItems && order.orderItems[idx]) {
            order.orderItems[idx].rating = 0;
            order.orderItems[idx].review = "";
            order.orderItems[idx].reviewedAt = null;
            await order.save();
            return res.json({ message: "Review removed successfully", order });
        }
        res.status(404).json({ message: "Order item not found" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review", error });
    }
});

// Admin: Upload an image file directly
app.post('/api/upload', (req, res) => {
    try {
        const { image, filename, folder } = req.body;
        if (!image) {
            return res.status(400).json({ message: "No image data provided" });
        }

        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let ext = 'jpg';
        let buffer;
        if (matches && matches.length === 3) {
            const mime = matches[1];
            if (mime.includes('png')) ext = 'png';
            else if (mime.includes('webp')) ext = 'webp';
            buffer = Buffer.from(matches[2], 'base64');
        } else {
            buffer = Buffer.from(image, 'base64');
        }

        const safeFolder = (folder === 'fragrance' || folder === 'fragrances' || folder === 'Fregerances') ? 'Fregerances' : 'Watches';
        const rawName = filename ? filename.replace(/[^a-zA-Z0-9._-]/g, '_') : `upload_${Date.now()}.${ext}`;
        const finalName = rawName.includes('.') ? rawName : `${rawName}.${ext}`;
        
        const targetDir = path.join(__dirname, '../client/public/assests/Products', safeFolder);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const filePath = path.join(targetDir, finalName);
        fs.writeFileSync(filePath, buffer);

        const publicUrl = `/assests/Products/${safeFolder}/${finalName}`;
        res.status(201).json({ message: "Image uploaded successfully", url: publicUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Failed to upload image", error: error.message });
    }
});

// Get all existing catalog images available on disk
app.get('/api/catalog-images', (req, res) => {
    try {
        const type = req.query.type || 'all';
        const baseDir = path.join(__dirname, '../client/public/assests/Products');
        const results = [];

        const readFolder = (folderName, categoryType) => {
            const folderPath = path.join(baseDir, folderName);
            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath);
                files.forEach(f => {
                    const ext = path.extname(f).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                        results.push({
                            name: f,
                            path: `/assests/Products/${folderName}/${f}`,
                            categoryType
                        });
                    }
                });
            }
        };

        if (type === 'watches' || type === 'all') readFolder('Watches', 'watch');
        if (type === 'fragrances' || type === 'all') readFolder('Fregerances', 'fragrance');

        res.json(results);
    } catch (error) {
        console.error("Error reading catalog images:", error);
        res.status(500).json({ message: "Error reading catalog images", error: error.message });
    }
});

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create new user
        const role = req.body.email === 'admin@chronoscent.com' ? 'admin' : (req.body.role || 'user');
        const newUser = new User({
            ...req.body,
            role,
            status: "active"
        });
        await newUser.save();
        
        res.status(201).json({ 
            message: "User registered successfully", 
            user: { name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// Login a user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Auto-provision admin account if logging in with default admin credentials
        let user = await User.findOne({ email });
        if (!user && email === 'admin@chronoscent.com' && password === 'admin123') {
            user = new User({
                name: "Executive Administrator",
                email: "admin@chronoscent.com",
                password: "admin123",
                role: "admin",
                status: "active"
            });
            await user.save();
        }

        // If user doesn't exist or password doesn't match
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if user account is blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ message: "Your account has been suspended by the administrator." });
        }

        const role = user.role || (user.email === 'admin@chronoscent.com' ? 'admin' : 'user');

        // Login successful
        res.json({ 
            message: "Login successful", 
            user: { 
                name: user.name, 
                email: user.email, 
                role: role,
                status: user.status || "active"
            } 
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

// Reset Password (Student level - simple email check)
app.put('/api/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Find the user by email and update their password
        const user = await User.findOneAndUpdate(
            { email: email }, 
            { password: newPassword }, 
            { new: true } // Returns the updated document
        );

        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error });
    }
});

// A simple test route
app.get('/', (req, res) => {
    res.send("Hello! The Chronoscent Elite backend is running!");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
