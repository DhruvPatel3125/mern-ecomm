require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors

// Middleware to parse JSON
app.use(express.json()); 

// CORS Configuration
const allowedOrigins = ['https://shy-shop-git-main-dhruvs-projects-7db11567.vercel.app', 'http://localhost:3000']; // Add your Vercel frontend URL and localhost for development

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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
