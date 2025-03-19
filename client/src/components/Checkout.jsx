import React from 'react'
import StripeCheckout from "react-stripe-checkout"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

export default function Checkout({ amount }) {
    const dispatch = useDispatch();
    const userState = useSelector(state => state.loginUserReducer);
    const { currentUser } = userState;
    
    // Make sure we have a valid amount
    const finalAmount = Math.round(amount * 100); // Convert to paise for Stripe
    
    const tokenHandler = async (token) => {
        try {
            dispatch({ type: 'PLACE_ORDER_REQUEST' });
            
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            const response = await axios.post('/api/orders/placeorder', {
                token,
                subtotal: amount,
                currentUser,
                cartItems
            });
            
            console.log('Payment Success:', response.data);
            
            dispatch({ type: 'PLACE_ORDER_SUCCESS' });
            
            // Clear cart after successful order
            localStorage.removeItem('cartItems');
            dispatch({ type: 'DELETE_FROM_CART', payload: [] });
            
            // Show success message (you can customize this)
            alert('Payment Successful! Your order has been placed.');
            
            // Redirect to home or order confirmation page
            window.location.href = '/';
            
        } catch (error) {
            console.error('Payment Error:', error);
            dispatch({ 
                type: 'PLACE_ORDER_FAILED', 
                payload: error.response?.data?.message || 'Payment failed. Please try again.'
            });
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div>
            {currentUser ? (
                <StripeCheckout
                    amount={finalAmount}
                    shippingAddress
                    token={tokenHandler}
                    stripeKey="pk_test_51R3aYhRoaufNrMbL8o7OU4lS7OGD15pizk2RWgPB2oMRMZB2SjfwKwTtZxKJNMPv1JC8okoxOEY3PKiHFap34WRc00VEBGt4iq" // ⚠️ REPLACE WITH YOUR ACTUAL PUBLISHABLE KEY
                    currency="INR"
                    name="Shay Shop"
                    description={`Your total is ₹${amount}`}
                    email={currentUser.email}
                >
                    <button className="btn">Checkout</button>
                </StripeCheckout>
            ) : (
                <div>
                    <p>Please login to checkout</p>
                    <a href="/login" className="btn">Login</a>
                </div>
            )}
        </div>
    );
}
