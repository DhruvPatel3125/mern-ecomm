import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../actions/productAction';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

export default function AddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addProductState = useSelector(state => state.addProductReducer || {});
  const { loading, error, success } = addProductState;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name,
      image,
      category,
      description,
      price: Number(price),
      countInStock: Number(countInStock),
    };
    
    await dispatch(addProduct(productData));
    if (!error) {
      setTimeout(() => {
        navigate('/admin/productslist');
      }, 2000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Add New Product</h2>
          {loading && <Loader />}
          {error && <Error error={error} />}
          {success && <Success message="Product added successfully!" />}
          
          <form onSubmit={handleSubmit} className="card p-4">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Count In Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
              />
            </div>
            
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
