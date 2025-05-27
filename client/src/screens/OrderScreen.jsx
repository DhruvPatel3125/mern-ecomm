import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderScreen.css';

export default function OrderScreen() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axios.get(`/api/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('Order not found. Please check the order ID and try again.');
                } else {
                    setError(err.message);
                }
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="order-details-container">
            <h1>Order Details</h1>
            {order && (
                <>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Customer:</strong> {order.name}</p>
                    <p><strong>Total:</strong> ₹{order.orderAmount}</p>
                    <h2>Items</h2>
                    <ul>
                        {order.orderItems.map((item, index) => (
                            <li key={item._id || item.productId || index}>
                                {item.name} - {item.quantity} x ₹{item.price}
                            </li>
                        ))}
                    </ul>
                    {order.shippingAddress && (
                        <div>
                            <h3>Shipping Address</h3>
                            <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                            <p><strong>City:</strong> {order.shippingAddress.city}</p>
                            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                        </div>
                    )}
                    {order.transactionId && (
                         <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                    )}
                     <p><strong>Delivery Status:</strong> {order.isDelivered ? 'Delivered' : 'Pending'}</p>
                </>
            )}
        </div>
    );
}