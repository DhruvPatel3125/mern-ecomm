require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies 

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
