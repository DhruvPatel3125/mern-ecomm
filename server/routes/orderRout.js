// routes/checkout.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const orderModel = require("../models/orderModel"); // Import the order model

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_Dz9hd6AMtKfCZE", // Replace with your test key ID
  key_secret: "rw9XkYczC8zyof55ca2LAT6z", // Replace with your test key secret
});

// Add Razorpay routes
router.post("/create-order", async (req, res) => {
  const { amount, currency, receipt } = req.body; // Expect amount, currency, receipt

  try {
    const options = {
      amount: amount, // Amount in paise
      currency: currency, // e.g., "INR"
      receipt: receipt, // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  const { order_id, payment_id, signature } = req.body; // Expect Razorpay signature, order_id, payment_id

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", "rw9XkYczC8zyof55ca2LAT6z"); // Use your test key secret
  shasum.update(`${order_id}|${payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === signature) {
    res.status(200).json({ message: "Payment successful" });
  } else {
    res.status(400).json({ message: "Payment verification failed" });
  }
});

// Add route to get a single order by ID
router.get("/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    // Assuming your order model is imported and named 'orderModel'
    // You might need to add 'const orderModel = require("../models/orderModel");' at the top if not already there.
    const orderModel = require("../models/orderModel"); // Ensure model is imported
    const order = await orderModel.findById(orderId);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found. Please check the order ID and try again." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add route to place an order after successful payment
router.post("/placeorder", async (req, res) => {
  const { currentUser, cartItems, subtotal, transactionId } = req.body; // Expect these details from frontend

  try {
    // Create a new order document
    const newOrder = new orderModel({
      userId: currentUser._id, // Assuming currentUser has _id
      name: currentUser.name, // Assuming currentUser has name
      email: currentUser.email, // Assuming currentUser has email
      orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          _id: item._id || item.productId, // Use _id or productId from cart item
          price: item.price,
      })),
      shippingAddress: { // You might need to get shipping address from the frontend as well
          address: currentUser.address || 'N/A', // Placeholder - get actual address
          city: currentUser.city || 'N/A', // Placeholder - get actual city
          postalCode: currentUser.postalCode || 0, // Placeholder - get actual postalCode
          country: currentUser.country || 'N/A', // Placeholder - get actual country
      },
      orderAmount: subtotal, // Use the subtotal for order amount
      transactionId: transactionId, // Store the Razorpay payment ID as transaction ID
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", orderId: savedOrder._id });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

// Add route to get all orders
router.get("/getallorders", async (req, res) => {
  try {
    const orderModel = require("../models/orderModel"); // Ensure model is imported if not already
    console.log("Attempting to fetch all orders from database."); // Log start of fetch
    const orders = await orderModel.find({});
    console.log("Fetched orders:", orders); // Log fetched orders
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error); // Log the actual error
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Add route to get orders for a specific user
router.get("/userorders", async (req, res) => {
  try {
    // Assuming user information is available in req.user after authentication
    const userId = req.user._id; 
    const orderModel = require("../models/orderModel"); // Ensure model is imported

    // Find orders where the userId matches the logged-in user's ID
    const userOrders = await orderModel.find({ userId: userId });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
});

module.exports = router;
