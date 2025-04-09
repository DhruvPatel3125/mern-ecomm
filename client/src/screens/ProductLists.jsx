import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getAllProducts } from '../reducers/productReducer';
import { deleteProduct } from '../reducers/productReducer';

export default function ProductLists() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.allProducts);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = useSelector((state) => state.deleteProduct);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(getAllProducts());
    }
  }, [deleteSuccess, dispatch]);

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId));
    }
  };

  if (loading || deleteLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (deleteError) return <Error error={deleteError} />;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Products List</h2>
      <Table striped bordered hover responsive className="mt-3" style={{ fontSize: '14px' }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th>Product ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.countInStock}</td>
              <td>{product.rating} ({product.numReviews} reviews)</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteProduct(product._id)}
                  style={{ marginRight: '5px' }}
                >
                  Delete
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate(`/admin/editproduct/${product._id}`)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
