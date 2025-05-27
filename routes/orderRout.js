// routes/checkout.js
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

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

module.exports = router;
