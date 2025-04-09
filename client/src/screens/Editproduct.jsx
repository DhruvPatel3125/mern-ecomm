import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../actions/productAction';
import { updateProductAction } from '../actions/productAction';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Success from '../components/Success';

export default function Editproduct() {
  const { productid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    countInStock: ''
  });

  const productState = useSelector(state => state.getProductByIdReducer);
  const updateState = useSelector(state => state.updateProductReducer || {});
  const { product, loading } = productState;
  const { loading: updateLoading, success: updateSuccess, error: updateError } = updateState;

  useEffect(() => {
    if (productid) {
      dispatch(getProductById(productid));
    }
  }, [dispatch, productid]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        image: product.image || '',
        category: product.category || '',
        countInStock: product.countInStock || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProductAction(productid, formData));
      if (!updateError) {
        setTimeout(() => {
          navigate('/admin/productslist');
        }, 1500);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading || updateLoading) return <Loading />;
  if (!product) return <Error error="Product not found" />;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4">Edit Product</h2>
          {updateError && <Error error={updateError} />}
          {updateSuccess && <Success message="Product updated successfully!" />}
          
          <form onSubmit={handleSubmit} className="card p-4">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Count In Stock</label>
              <input
                type="number"
                name="countInStock"
                className="form-control"
                value={formData.countInStock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <button type="submit" className="btn" disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
