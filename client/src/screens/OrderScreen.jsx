import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
        <div>
            <h1>Order Details</h1>
            {order && (
                <>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Total:</strong> ${order.totalPrice}</p>
                    <h2>Items</h2>
                    <ul>
                        {order.items.map((item) => (
                            <li key={item.productId}>
                                {item.name} - {item.quantity} x ${item.price}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}