import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

export default function Checkout({ amount }) {
    const dispatch = useDispatch();
    const userState = useSelector(state => state.loginUserReducer);
    const { currentUser } = userState;
    
    // Make sure we have a valid amount and it's greater than zero
    const finalAmount = Math.max(1, Math.round(amount * 100)); // Minimum 1 (1 paise)
    
    // Razorpay script loader
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        // Make sure cart is not empty before creating order
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (!cartItems.length) {
             alert("Your cart is empty");
             return;
        }

        // Call backend to create order
        try {
            dispatch({ type: 'PLACE_ORDER_REQUEST' }); // Indicate order process start

            const { data: order } = await axios.post('/api/orders/create-order', {
                amount: amount * 100, // Razorpay expects amount in paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`, // Simple unique receipt
            });

            const options = {
                key: 'rzp_test_Dz9hd6AMtKfCZE', // Replace with your test key ID
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: 'Shay Shop',
                description: `Payment for Order ID: ${order.id}`,
                image: 'your_logo_url', // Replace with your logo URL if you have one
                handler: async function (response) {
                    // Payment successful, verify signature on backend
                    try {
                        const verificationResponse = await axios.post('/api/orders/verify-payment', {
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        if (verificationResponse.status === 200) {
                            console.log('Payment Success:', verificationResponse.data);
                            
                            // Now, place the order in your database
                            try {
                                // Get cart items and user info
                                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                                const userState = JSON.parse(localStorage.getItem('currentUser')); // Assuming user info is in localStorage
                                // You might need to adjust how you get user info if it's not in localStorage

                                if (!userState || !userState._id) {
                                    throw new Error("User information not available.");
                                }

                                const orderPlacementResponse = await axios.post('/api/orders/placeorder', {
                                    currentUser: userState,
                                    cartItems: cartItems,
                                    subtotal: amount, // Use the original amount
                                    transactionId: response.razorpay_payment_id, // Pass the Razorpay payment ID
                                });

                                console.log('Order Placed:', orderPlacementResponse.data);

                                dispatch({ type: 'PLACE_ORDER_SUCCESS' });
                                // Clear cart after successful order placement
                                localStorage.removeItem('cartItems');
                                dispatch({ type: 'DELETE_FROM_CART', payload: [] });

                                alert('Payment Successful! Your order has been placed.');
                                
                                // Redirect to the order details page
                                // Assuming the backend returns orderId in the response
                                const orderId = orderPlacementResponse.data.orderId;
                                if (orderId) {
                                    window.location.href = `/order/${orderId}`;
                                } else {
                                    // Fallback redirect if orderId is not returned
                                    window.location.href = '/';
                                }

                            } catch (orderError) {
                                console.error('Error placing order after verification:', orderError);
                                dispatch({ type: 'PLACE_ORDER_FAILED', payload: 'Error placing order' });
                                alert(`Payment successful, but failed to place order: ${orderError.message}`);
                                // Consider redirecting to an error page or showing a message
                                window.location.href = '/'; // Redirect to home or an error page
                            }

                        } else {
                            console.error('Payment Verification Failed:', verificationResponse.data);
                            dispatch({ type: 'PLACE_ORDER_FAILED', payload: 'Payment verification failed' });
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment Verification Error:', error);
                        dispatch({ type: 'PLACE_ORDER_FAILED', payload: 'Error verifying payment' });
                        alert('An error occurred during payment verification.');
                    }
                },
                prefill: {
                    name: currentUser.name,
                    email: currentUser.email,
                    contact: currentUser.contact || '', // Assuming user model has a contact field or add one
                },
                notes: {
                    address: 'User Address', // Add user address details if available
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Failed to create Razorpay order. Please try again.';

            dispatch({ type: 'PLACE_ORDER_FAILED', payload: errorMessage });
            alert(`Order creation failed: ${errorMessage}`);
        }
    };

    return (
        <div>
            {currentUser ? (
                <button className="btn" onClick={displayRazorpay}>Pay Now ₹{amount}</button>
            ) : (
                <div>
                    <p>Please login to checkout</p>
                    <a href="/login" className="btn">Login</a>
                </div>
            )}
        </div>
    );
}
