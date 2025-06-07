const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 500
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema]
}, {
    timestamps: true
});

// Add a pre-save middleware to update rating and numReviews
productSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        this.rating = Number((this.reviews.reduce((acc, item) => item.rating + acc, 0) 
                    / this.reviews.length).toFixed(1));
        this.numReviews = this.reviews.length;
    } else {
        this.rating = 0;
        this.numReviews = 0;
    }
    next();
});

module.exports = mongoose.model('products', productSchema);