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

module.exports = router;
