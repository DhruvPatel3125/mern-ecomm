import React from 'react'
import StripeCheckout from "react-stripe-checkout"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

export default function Checkout({ amount }) {
    const dispatch = useDispatch();
    const userState = useSelector(state => state.loginUserReducer);
    const { currentUser } = userState;
    
    // Make sure we have a valid amount and it's greater than zero
    const finalAmount = Math.max(1, Math.round(amount * 100)); // Minimum 1 (1 paise)
    
    const tokenHandler = async (token) => {
        try {
            console.log("Token received:", token); // Debug token
            
            dispatch({ type: 'PLACE_ORDER_REQUEST' });
            
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Make sure cart is not empty
            if (!cartItems.length) {
                throw new Error("Your cart is empty");
            }
            
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
            
            // Show success message
            alert('Payment Successful! Your order has been placed.');
            
            // Redirect to home or order confirmation page
            window.location.href = '/';
            
        } catch (error) {
            console.error('Payment Error:', error);
            
            // Get the most useful error message
            const errorMessage = 
                error.response?.data?.error || 
                error.response?.data?.message || 
                error.message || 
                'Payment failed. Please try again.';
                
            dispatch({ type: 'PLACE_ORDER_FAILED', payload: errorMessage });
            
            alert(`Payment failed: ${errorMessage}`);
        }
    };

    return (
        <div>
            {currentUser ? (
                <StripeCheckout
                    amount={finalAmount}
                    shippingAddress
                    token={tokenHandler}
                    stripeKey="pk_test_51R4FemRte5P3YdHuiiZoB5xBJwXw1Libwr90Kc65VI8da4VNydkgeDYnh4tnODltuuOhn06P6zzDl2a6VC4CHg9700UGwrazmY"
                    currency="INR"
                    name="Shay Shop"
                    description={`Your total is ₹${amount}`}
                    email={currentUser.email}
                    billingAddress={true}
                    zipCode={true}
                    allowRememberMe={true}
                    reconfigureOnUpdate={false}
                    // Test card: use 4242 4242 4242 4242, any future date, any 3 digits for CVC, any 5 digits for postal
                >
                    <button className="btn">Pay Now ₹{amount}</button>
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
