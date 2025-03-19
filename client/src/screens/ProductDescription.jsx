import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../actions/productAction";
import { addtocart } from "../actions/cartAction";
import Loading from "../components/Loader";
import Error from "../components/Error";

export default function ProductDescription() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, product, error } = useSelector(
    (state) => state.getProductByIdReducer
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  if (loading) return <div className="loading-spinner"><Loading /></div>;
  if (error) return <div className="error-message"><Error error="Something went wrong"/></div>;
  if (!product) return <div className="error-message">Product not found</div>;

  const handleAddToCart = () => {
    console.log("Adding to cart:", product, quantity);
    dispatch(addtocart(product, quantity));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img
              src={product.image}
              className="product-detail-image"
              alt={product.name}
            />
            <div className="card-body">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-description">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2 className="product-price mb-4">Price: ${product.price}</h2>
            <div className="mb-3">
              <h3 className="mb-2">Select Quantity</h3>
              <select
                className="quantity-selector"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
            <button 
              className="btn btn-dark add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.countInStock}
            >
              {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
