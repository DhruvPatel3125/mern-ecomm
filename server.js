const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware to parse JSON
app.use(express.json()); 

// Database connection
require('./db');

// Import routes
const productsRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRout = require('./routes/orderRout')

// Use routes
app.use('/api/products/', productsRoute);
app.use('/api/users/', userRoute);
app.use('/api/orders/',orderRout)

// Root endpoint
app.get("/", (req, res) => {
    res.send("This is the backend");
});

// Server listening
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
