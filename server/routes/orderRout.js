// routes/checkout.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const orderModel = require("../models/orderModel"); // Import the order model

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RZP_KEY_ID, // Replace with your test key ID
  key_secret: process.env.RZP_KEY_SEC, // Replace with your test key secret
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

  const shasum = crypto.createHmac("sha256", process.env.RZP_KEY_SEC); // Use your test key secret
  shasum.update(`${order_id}|${payment_id}`);
  const digest = shasum.digest("hex");

  if (digest === signature) {
    res.status(200).json({ message: "Payment successful" });
  } else {
    res.status(400).json({ message: "Payment verification failed" });
  }
});

// Test route to check database connection (MUST come before /:id route)
router.get("/test", async (req, res) => {
  try {
    console.log("Testing database connection...");
    const testQuery = await orderModel.countDocuments();
    console.log("Database connection successful. Order count:", testQuery);
    res.status(200).json({ 
      message: "Database connection successful", 
      orderCount: testQuery,
      model: "orderModel is working",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection test failed:', error);
    res.status(500).json({ 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Add route to get all orders
router.get("/getallorders", async (req, res) => {
  try {
    console.log("Attempting to fetch all orders from database.");
    
    // First check if we can connect to the database
    const orderCount = await orderModel.countDocuments();
    console.log("Total orders in database:", orderCount);
    
    if (orderCount === 0) {
      console.log("No orders found in database");
      return res.status(200).json([]);
    }
    
    const orders = await orderModel.find({}).sort({ createdAt: -1 }).lean();
    console.log("Fetched orders count:", orders.length);
    console.log("Sample order:", orders[0]);
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

// Add route to get orders for a specific user
router.get("/userorders", async (req, res) => {
  try {
    // Assuming user information is available in req.user after authentication
    const userId = req.user._id; 

    // Find orders where the userId matches the logged-in user's ID
    const userOrders = await orderModel.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
});

// Add route to mark order as delivered
router.put("/delivered/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order and update its delivery status
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { 
        isDelivered: true,
        deliveredAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`Order ${orderId} marked as delivered successfully`);
    res.status(200).json({ 
      message: "Order marked as delivered successfully", 
      order: order 
    });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ 
      message: 'Failed to mark order as delivered', 
      error: error.message 
    });
  }
});

// Add route to get orders by user ID (for admin)
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const userOrders = await orderModel.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user orders', 
      error: error.message 
    });
  }
});

// Add route to get a single order by ID (MUST be last to avoid conflicts)
router.get("/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found. Please check the order ID and try again." });
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
