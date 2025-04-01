import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, deleteReview, editReview } from "../actions/productAction";
import { addtocart } from "../actions/cartAction";
import Loading from "../components/Loader";
import Error from "../components/Error";
import Review from "../components/Review";
import Rating from "react-rating"; // Ensure this is the correct library or file path

export default function ProductDescription() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, product, error } = useSelector(
    (state) => state.getProductByIdReducer
  );
  const userState = useSelector(state => state.loginUserReducer);
  const { currentUser } = userState;
  const [quantity, setQuantity] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(5);

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

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const handleUpdateReview = async () => {
    await dispatch(editReview(product._id, editingReview._id, {
      rating: editedRating,
      comment: editedComment
    }));
    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await dispatch(deleteReview(product._id, reviewId));
    }
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
          <hr />
          <Review product={product}/>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6">
          <h3>Reviews ({product.reviews?.length || 0})</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">{review.name}</h5>
                    {currentUser && currentUser._id === review.userid && (
                      <div className="review-actions">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditReview(review)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingReview && editingReview._id === review._id ? (
                    <div className="edit-review-form mt-3">
                      <Rating
                        initialRating={editedRating}
                        emptySymbol="fa fa-star-o fa-1x"
                        fullSymbol="fa fa-star fa-1x"
                        onChange={value => setEditedRating(value)}
                      />
                      <textarea
                        className="form-control mt-2"
                        value={editedComment}
                        onChange={e => setEditedComment(e.target.value)}
                      />
                      <div className="mt-2">
                        <button 
                          className="btn btn-primary btn-sm me-2"
                          onClick={handleUpdateReview}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingReview(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Rating
                        initialRating={review.rating}
                        emptySymbol="fa fa-star-o fa-1x"
                        fullSymbol="fa fa-star fa-1x"
                        readonly
                      />
                      <p className="card-text mt-2">{review.comment}</p>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
        {/* ...existing Review component... */}
      </div>
    </div>
  );
}
