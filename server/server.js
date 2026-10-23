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

const app = express();

app.use(cors());
app.use(express.json());

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

// Connect to local MongoDB Compass
mongoose.connect('mongodb://127.0.0.1:27017/chronoscent')
    .then(() => {
        console.log('Successfully connected to MongoDB!');
        seedBaselineBrandsAndCategories();
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
        const newWatch = new Watch(req.body);
        await newWatch.save();
        res.status(201).json(newWatch);
    } catch (error) {
        res.status(500).json({ message: "Error creating watch", error });
    }
});

// Admin: Update a watch
app.put('/api/watches/:id', async (req, res) => {
    try {
        const updatedWatch = await Watch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedWatch);
    } catch (error) {
        res.status(500).json({ message: "Error updating watch", error });
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
        const newFragrance = new Fragrance(req.body);
        await newFragrance.save();
        res.status(201).json(newFragrance);
    } catch (error) {
        res.status(500).json({ message: "Error creating fragrance", error });
    }
});

// Admin: Update a fragrance
app.put('/api/fragrances/:id', async (req, res) => {
    try {
        const updatedFragrance = await Fragrance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFragrance);
    } catch (error) {
        res.status(500).json({ message: "Error updating fragrance", error });
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

// Admin: Delete a User
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
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
