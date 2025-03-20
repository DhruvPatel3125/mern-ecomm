const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51R4FemRte5P3YdHuH2qlgSZjWVMmwbneZMiDNN65RA0UZGE4lf8GiKpmYRJiUiPLVE7WcYo9jnAsex5l8pd5AKwo00Zbj0adLv"
);
const Order = require("../models/orderModel");

router.post("/placeorder", async (req, res) => {
  const { token, cartItems, currentUser, subtotal } = req.body;

  try {
    // Validate required data
    if (!token || !token.id || !token.email || !subtotal) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
      });
    }

    // Create a customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    // Create the payment
    const payment = await stripe.charges.create(
      {
        amount: Math.round(subtotal * 100), // Convert to paise and ensure it's an integer
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
        description: `Order by ${token.email}`,
      },
      {
        idempotencyKey: uuidv4(), // Prevent duplicate charges
      }
    );

    // If payment was successful, create the order in database
    if (payment) {
      const newOrder = new Order({
        userId: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        orderItems: cartItems,
        shippingAddress: {
          address: token.card.address_line1,
          city: token.card.address_city,
          postalCode: token.card.address_zip,
          country: token.card.address_country,
        },
        orderAmount: subtotal,
        transactionId: payment.source.id,
        isDelivered: false,
      });

      // Save order using async/await instead of callback
      const savedOrder = await newOrder.save();
      
      // Return success response with payment and order data
      return res.status(200).json({
        success: true,
        message: "Order placed successfully",
        paymentId: payment.id,
        amount: payment.amount / 100,
        order: savedOrder
      });
    } else {
      throw new Error("Payment verification failed");
    }
  } catch (error) {
    console.error("Payment or order error:", error);
    res.status(400).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
});

module.exports = router;
