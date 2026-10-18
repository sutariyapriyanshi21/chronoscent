const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import our models so the server knows what a Watch and Fragrance is
const Watch = require('./models/Watch');
const Fragrance = require('./models/Fragerence');
const Order = require('./models/Order');
const User = require('./models/User'); // Added User model for authentication

const app = express();

app.use(cors());
app.use(express.json());

// Connect to local MongoDB Compass
mongoose.connect('mongodb://127.0.0.1:27017/chronoscent')
    .then(() => console.log('Successfully connected to MongoDB!'))
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

// ==========================================
// AUTHENTICATION ROUTES (Student Level - Simple)
// ==========================================

// Register a new user
app.post('/api/register', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create new user (saving password as plain text for simplicity, usually you would hash it)
        const newUser = new User(req.body);
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully", user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// Login a user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // If user doesn't exist or password doesn't match
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Login successful
        res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
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
