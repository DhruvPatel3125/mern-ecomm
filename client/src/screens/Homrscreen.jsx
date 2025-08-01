import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../actions/productAction";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function Homescreen() {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.allProducts);
  const { loading, products, error } = productState;

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      {loading ? (
        <div className="loading-spinner">
          <Loader />
        </div>
      ) : error ? (
        <div className="error-message">
          <Error error="Something went Wrong..." />
        </div>
      ) : (
        <div className="row">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <Product product={product} />
              </div>
            ))
          ) : (
            <div>No products found</div>
          )}
        </div>
      )}
    </div>
  );
}
//compete mern ecommerce website

