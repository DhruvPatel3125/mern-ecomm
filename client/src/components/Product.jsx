import React from "react";
import { Link } from "react-router-dom";
import Rating from "react-rating";
import "font-awesome/css/font-awesome.min.css";

export default function Product({ product }) {
  console.log("Product data:", product);
  
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
        <img 
          src={product.image} 
          className="product-image text-center" 
          alt={product.name} 
        ></img>
        <h1 className="product-title">{product.name}</h1>
        <div className="rating-stars">
          <Rating
            initialRating={product.rating}
            emptySymbol="fa fa-star-o fa-1x"
            fullSymbol="fa fa-star fa-1x"
            readonly={true}
          />
        </div>
        <h1 className="product-price">Price: ${product.price}</h1>
      </Link>
    </div>
  );
}
