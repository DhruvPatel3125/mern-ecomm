import React, { useState } from "react";
import Rating from "react-rating";
import { useDispatch, useSelector } from "react-redux";
import { addproductReview } from "../actions/productAction";
import Success from "./Success";
import Error from "./Error";
import Loader from "./Loader";  

export default function Review({ product }) {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    
    const reviewState = useSelector(state => state.addproductReviewReducer);
    const { loading, success, error } = reviewState;
    
    const userState = useSelector(state => state.loginUserReducer);
    const { currentUser } = userState;

    function sendreview(e) {
        e.preventDefault();
        if (!currentUser) {
            alert("Please login to submit review");
            return;
        }

        const review = {
            rating: rating,
            comment: comment
        }
        
        dispatch(addproductReview(review, product._id));
        
        // Clear form after successful submission
        if (!error) {
            setRating(5);
            setComment("");
        }
    }

    return (
        <div>
            <h2>Give Your Review</h2>
            {loading && <Loader />}
            {error && <Error error={error} />}
            {success && <Success message="Review submitted successfully!" />}
            
            <form onSubmit={sendreview}>
                <div className="mb-3">
                    <Rating
                        style={{color:"orange"}}
                        initialRating={rating}
                        emptySymbol="fa fa-star-o fa-1x"
                        fullSymbol="fa fa-star fa-1x"
                        onChange={(value) => setRating(value)}
                    />
                </div>
                
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                        required
                    />
                </div>
                
                <button 
                    className="btn"
                    type="submit"
                    disabled={loading || !currentUser}
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
}
