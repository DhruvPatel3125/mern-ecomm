const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users' // Reference to the User model
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            _id: { type: String, required: true }, // Using String for _id, ensure it matches product._id from frontend
            price: { type: Number, required: true },
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
        country: { type: String, required: true },
    },
    orderAmount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
}, {
    timestamps: true
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
