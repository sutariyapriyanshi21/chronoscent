const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
});

const orderSchema = new mongoose.Schema({
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip: { type: String, required: true }
    },
    orderItems: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
