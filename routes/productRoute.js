const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.get('/getallproducts', (req, res) => {
    Product.find({})
    .then(products => {
      res.status(200).json(products);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  
});

// Add the getproductbyid route
router.get('/getproductbyid/:id', async (req, res) => {
  try {
    console.log("Received request for product ID:", req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log("Found product:", product);
    res.json(product);
  } catch (error) {
    console.error("Error in getproductbyid:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
