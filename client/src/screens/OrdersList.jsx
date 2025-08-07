import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { getAllOrders, markOrderDelivered } from '../actions/orderAction';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import './OrdersList.css';

export default function OrdersList() {
    const dispatch = useDispatch();
    const ordersState = useSelector(state => state.getAllOrders) || {};
    const { loading = false, error = null, orders = [] } = ordersState;

    useEffect(() => {
        console.log('OrdersList component mounted, fetching orders...');
        console.log('Current orders state:', ordersState);
        dispatch(getAllOrders());
    }, [dispatch]);

    // Log when orders state changes
    useEffect(() => {
        console.log('Orders state updated:', { loading, error, ordersCount: orders.length });
        if (orders.length > 0) {
            console.log('Sample order data:', orders[0]);
        }
    }, [loading, error, orders]);

    const handleMarkDelivered = async (orderId) => {
        if (window.confirm('Mark this order as delivered?')) {
            try {
                dispatch(markOrderDelivered(orderId));
            } catch (error) {
                console.error('Error marking order as delivered:', error);
            }
        }
    };

    const handleTestConnection = async () => {
        try {
            console.log('Starting connection test...');
            const response = await fetch('/api/orders/test');
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Test response data:', data);
            
            const message = data.message || 'No message';
            const orderCount = data.orderCount !== undefined ? data.orderCount : 'Unknown';
            
            alert(`Connection test: ${message}. Order count: ${orderCount}`);
        } catch (error) {
            console.error('Test failed:', error);
            alert(`Test failed: ${error.message}`);
        }
    };

    const handleCreateSampleOrder = async () => {
        try {
            const sampleOrder = {
                currentUser: {
                    _id: "sample_user_id",
                    name: "Test User",
                    email: "test@example.com"
                },
                cartItems: [
                    {
                        _id: "sample_product_1",
                        name: "Sample Product",
                        quantity: 2,
                        price: 25.99
                    }
                ],
                subtotal: 51.98,
                transactionId: "test_transaction_" + Date.now()
            };

            const response = await fetch('/api/orders/placeorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sampleOrder)
            });

            const data = await response.json();
            console.log('Sample order created:', data);
            alert('Sample order created successfully!');
            dispatch(getAllOrders()); // Refresh the orders list
        } catch (error) {
            console.error('Failed to create sample order:', error);
            alert(`Failed to create sample order: ${error.message}`);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-center flex-grow-1">Orders List</h2>
                    <div>
                        <Button variant="outline-secondary" size="sm" onClick={handleTestConnection} className="me-2">
                            <i className="fas fa-plug me-1"></i>
                            Test Connection
                        </Button>
                        <Button variant="outline-success" size="sm" onClick={handleCreateSampleOrder} className="me-2">
                            <i className="fas fa-plus me-1"></i>
                            Create Sample Order
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => dispatch(getAllOrders())}>
                            <i className="fas fa-sync me-1"></i>
                            Refresh
                        </Button>
                    </div>
                </div>

                {loading && <Loader />}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error Loading Orders</h4>
                        <p>{error}</p>
                        <hr />
                        <p className="mb-0">
                            <Button variant="outline-danger" onClick={() => dispatch(getAllOrders())}>
                                <i className="fas fa-redo me-1"></i>
                                Retry
                            </Button>
                        </p>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="text-center">
                        <div className="alert alert-info">
                            <i className="fas fa-info-circle me-2"></i>
                            No orders found in the system.
                        </div>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="table-responsive">
                        <Table striped bordered hover className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order._id || `order-${index}`}>
                                        <td>
                                            <small className="text-muted">
                                                {order._id ? order._id.substring(order._id.length - 8) : 'No ID'}
                                            </small>
                                        </td>
                                        <td>{order.name || order.userId || 'N/A'}</td>
                                        <td>
                                            <strong>${order.orderAmount ? order.orderAmount.toFixed(2) : '0.00'}</strong>
                                        </td>
                                        <td>{order.createdAt ? moment(order.createdAt).format('MMM Do YYYY, h:mm A') : 'N/A'}</td>
                                        <td>
                                            <div className="items-list">
                                                {order.orderItems && Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
                                                    order.orderItems.slice(0, 2).map((item, index) => (
                                                        <div key={item._id || item.id || index} className="item-detail">
                                                            <small>{item.name || 'Unknown Item'} × {item.quantity || 0}</small>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <small className="text-muted">No items</small>
                                                )}
                                                {order.orderItems && order.orderItems.length > 2 && (
                                                    <small className="text-muted">
                                                        +{order.orderItems.length - 2} more...
                                                    </small>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                <span className="badge bg-success">
                                                    <i className="fas fa-check-circle me-1"></i>
                                                    Delivered
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning text-dark">
                                                    <i className="fas fa-clock me-1"></i>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {order._id && (
                                                <Button 
                                                    variant="outline-info" 
                                                    size="sm"
                                                    onClick={() => window.location.href = `/order/${order._id}`}
                                                    className="me-1"
                                                >
                                                    <i className="fas fa-eye me-1"></i>
                                                    View
                                                </Button>
                                            )}
                                            {!order.isDelivered && order._id && (
                                                <Button 
                                                    variant="outline-success" 
                                                    size="sm"
                                                    onClick={() => handleMarkDelivered(order._id)}
                                                >
                                                    <i className="fas fa-truck me-1"></i>
                                                    Deliver
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
}
