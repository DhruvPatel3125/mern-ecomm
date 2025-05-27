import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios'; // Use axios for fetching user orders
import Loading from '../components/Loading';
import Error from '../components/Error';
import moment from 'moment';
// You might want to create a specific CSS for this page later
// import './UserOrdersScreen.css'; 

export default function UserOrdersScreen() {
    const dispatch = useDispatch();
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    // Fetch user orders on component mount
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                // Call the new backend route to get user orders
                const { data } = await axios.get('/api/orders/userorders');
                setOrders(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user orders:', err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, [dispatch]); // Added dispatch to dependency array

    return (
        <div className="row justify-content-center">
            <div className="col-md-10"> {/* Adjusted column size */}
                <h2 className="text-center mb-4">My Orders</h2>
                {loading && <Loading />}
                {error && <Error error={error} />}

                {!loading && !error && orders.length === 0 && (
                    <div className="text-center">
                        <p>You have not placed any orders yet.</p>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="table-responsive">
                        <Table striped bordered hover> {/* You can add a class for styling later */}
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>₹{order.orderAmount}</td> {/* Use orderAmount and currency symbol */}
                                        <td>{moment(order.createdAt).format('MMM Do YYYY')}</td>
                                        <td>
                                            {order.orderItems.map(item => (
                                                <div key={item._id}> {/* Use item._id for key */}
                                                    {item.name} x {item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                <span className="badge bg-success">Delivered</span>
                                            ) : (
                                                <span className="badge bg-warning">Pending</span>
                                            )}
                                        </td>
                                        <td>
                                            {/* Link to individual order details page */}
                                            <Button 
                                                variant="info" 
                                                size="sm"
                                                href={`/order/${order._id}`}
                                            >
                                                View Details
                                            </Button>
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