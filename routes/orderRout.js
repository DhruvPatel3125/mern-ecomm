// routes/checkout.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")( "sk_test_51R4FemRte5P3YdHuH2qlgSZjWVMmwbneZMiDNN65RA0UZGE4lf8GiKpmYRJiUiPLVE7WcYo9jnAsex5l8pd5AKwo00Zbj0adLv"
);

router.post("/create-checkout-session", async (req, res) => {
  const { cartItems } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
