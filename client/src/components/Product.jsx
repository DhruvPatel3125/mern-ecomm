import React from "react";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import "font-awesome/css/font-awesome.min.css";
import "./Product.css";

export default function Product({ product }) {
  console.log("Product data:", product);
  
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="image-container">
          <img 
            src={product.image} 
            className="product-image" 
            alt={product.name} 
          />
        </div>
        <div className="product-content">
          <h2 className="product-title">{product.name}</h2>
          <div className="rating-stars">
            <Rating
              initialRating={product.rating}
              emptySymbol="fa fa-star-o fa-1x"
              fullSymbol="fa fa-star fa-1x"
              readonly={true}
            />
          </div>
          <p className="product-price">${product.price}</p>
        </div>
      </Link>
    </div>
  );
}