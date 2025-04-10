const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware to parse JSON
app.use(express.json()); 

// Database connection
require('./db');

// Import routes
const productRoute = require('./routes/productRoute');
const userRoute = require("./routes/userRoute");
const orderRout = require('./routes/orderRout')
const path = require('path')

// Use routes
app.use('/api/products', productRoute);
app.use('/api/users/', userRoute);
app.use('/api/orders/',orderRout)

// Root endpoint
app.get("/", (req, res) => {
    res.send("This is the backend");
});

// Server listening
const port = process.env.PORT || 8000;
app.listen(port,()=> console.log(`node js server started`))

if(process.env.NODE_ENV === 'production'){ 
    app.use(express.static(path.join(__dirname,'/client/build')))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client/build/index.html'))
    })
}