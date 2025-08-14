require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://shy-shop.vercel.app",
];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl, Postman) which may have no Origin
    if (!origin) return callback(null, true);

    const isWhitelisted =
      allowedOrigins.includes(origin) ||
      // Optional: allow any Vercel preview like https://<branch>-<org>.vercel.app
      /\.vercel\.app$/.test(new URL(origin).hostname);

    if (isWhitelisted) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Only if you use cookies/auth headers across origins
};

// Apply before routes
app.use(cors(corsOptions));
// Make sure preflight requests succeed quickly
app.options("*", cors(corsOptions));

// Database connection
require('./db');

// Import routes
const productRoute = require('./routes/productRoute');
const userRoute = require("./routes/userRoute");
const orderRout = require('./routes/orderRout')

// Use routes
app.use('/api/products', productRoute);
app.use('/api/users/', userRoute);
app.use('/api/orders/',orderRout)

// Root endpoint
app.get("/", (req, res) => {
    res.send("This is the backend");
});

// Server listening
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
