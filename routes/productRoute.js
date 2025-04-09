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
    const productId = req.params.id;
    console.log("Fetching product with ID:", productId);
    
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log("Product found:", product);
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

router.post('/addreview', async(req, res) => {
  try {
    const { review, productid, currentUser } = req.body;
    
    const product = await Product.findById(productid);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const reviewModel = {
      name: currentUser.name,
      userid: currentUser._id,
      rating: review.rating,
      comment: review.comment,
    };

    product.reviews.push(reviewModel);
    
    // Update product rating
    const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    
    res.status(200).json({ message: 'Review added successfully' });
    
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(400).json({ message: 'Something went wrong' });
  }
});

router.delete('/:productId/reviews/:reviewId', async (req, res) => {
    try {
        const { productId, reviewId } = req.params;
        const { userid } = req.body;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the review index
        const reviewIndex = product.reviews.findIndex(
            review => review._id.toString() === reviewId && review.userid.toString() === userid
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        // Remove the review
        product.reviews.splice(reviewIndex, 1);

        // Recalculate average rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
            product.rating = totalRating / product.reviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        res.json({ message: 'Review deleted successfully' });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Error deleting review' });
    }
});

// Add this route handler for editing reviews
router.put('/:id/reviews/:reviewId', async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        const { rating, comment, userid } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const reviewIndex = product.reviews.findIndex(
            review => review._id.toString() === reviewId && 
                     review.userid.toString() === userid
        );

        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        // Update the review
        product.reviews[reviewIndex].rating = rating;
        product.reviews[reviewIndex].comment = comment;

        await product.save();
        res.json({ message: 'Review updated successfully', product });

    } catch (error) {
        console.error('Edit review error:', error);
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
});

// Add delete product endpoint
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

// Add new route for creating a product
router.post('/add', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Add update product endpoint
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updating product:', id, updates);

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.keys(updates).forEach((key) => {
      product[key] = updates[key];
    });

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

module.exports = router;
