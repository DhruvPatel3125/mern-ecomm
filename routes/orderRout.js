const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51R3aYhRoaufNrMbLkDoMbKKld8ROjdYJ8mGnkDh1HGfbvnRwpMSPwhyRGuWVSlfUPyGi3bmubn4IRdJHFQ6nv5yZ00lgWXz3xO"
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

    // Return success response with payment data
    res.status(200).json({
      success: true,
      message: "Payment successful",
      paymentId: payment.id,
      amount: payment.amount / 100, // Convert back to rupees for display
      customer: payment.customer,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(400).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
  if (payment) {
    const order = new Order({
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
    order.save((err) => {
      if (err) return res.status(500).json({ message: "some error occured" });
      else {
        res.status(200).json({
          success: true,
          message: "Order placed successfully",
          order,
        });
      }
    });
  } else {
    return res.status(400).json({ message: "payment failed" });
  }
});

module.exports = router;
