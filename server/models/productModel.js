const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String
            },
            comment: {
                type: String
            },
            rating: {
                type: Number
            },
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'users'
            }
        }
    ]
}, {
    timestamps: true
});

const Product = mongoose.model('products', productSchema);

module.exports = Product; 