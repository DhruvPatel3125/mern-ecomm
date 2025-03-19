import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { filterProducts } from "../actions/productAction";

export default function Filter() {
  const [searchkey, setsearchkey] = useState("");
  const [sort, setsort] = useState("popular");
  const [category, setcategory] = useState("all");

  const dispatch = useDispatch();

  return (
    <div>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-3 mt-4 ml-md-2">
          <input
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            
            type="text"
            placeholder="Search Product"
            className="form-control"
          />
        </div>
        <div className="col-md-2 mt-4 ml-md-2">
          <select
            className="form-control"
            value={sort}
            onChange={(e) => setsort(e.target.value)}
          >
            <option value="popular">Popular</option>
            <option value="htl">High to Low</option>
            <option value="lth">Low to High</option>
          </select>
        </div>
        <div className="col-md-2 mt-4 ml-2">
          <select
            className="form-control"
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="mobiles">Mobiles</option>
            <option value="games">Games</option>
          </select>
        </div>
        <div className="col-md-2 mt-4 ml-2">
          <button className="btn" onClick={()=>{dispatch(filterProducts(searchkey,sort,category))}}>Filter</button>
        </div>
      </div>
    </div>
  );
}
