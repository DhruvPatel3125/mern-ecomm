import React, { useState } from "react";
import Rating from "react-rating";
import { useDispatch,useSelector } from "react-redux";
import { addproductReview } from "../actions/productAction";

export default function Review({product}) {
    const dispatch = useDispatch()
    const [rating,setRating] = useState(5)
    const [comment,setComment] = useState("")
    function sendreview(){
        const review ={
            rating:rating,
            comment:comment
        }
        dispatch(addproductReview(review,product._id))
    }
  return (
    <div>
      <h2>Give Your Review</h2>

      <Rating
      style={{color:"orange"}}
        initialRating={rating}
        emptySymbol="fa fa-star-o fa-1x"
        fullSymbol="fa fa-star fa-1x"
        onChange={(e)=>{setRating(e)}}
        
      />
        <input type="text" className="form-control mt-2 ml-5" value={comment} onChange={(e)=>setComment(e.target.value)}/>
        <button className="btn mt-3" onClick={sendreview}>Submit Review</button>
    </div>
  );
}
