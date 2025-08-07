import axios from "axios";

const API = axios.create({ 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/' 
});

export const placeholder = (token, subtotal) => (dispatch, getState) => {
  const currentUser = getState().loginUserReducer.currentUser;
  const demoItems = getState().cartReducer.cartItems;

  const cartItems = new Array();

  for(var i=0;i<demoItems.length;i++){
    var item ={
      name : demoItems[i].name,
      quantity : demoItems[i].quantity,
      price : demoItems[i].price,
      _id:demoItems[i]._id

    }
    cartItems.push(item)
  }


  dispatch({ type: "PLACE_ORDER_REQUEST" });

  API.post("/api/orders/placeorder", { token, subtotal, currentUser, cartItems })
    .then((res) => {
      dispatch({ type: "PLACE_ORDER_SUCCESS" });
      console.log(res)
    })
    .catch((err) => {
      console.error("Order creation failed:", err.response?.data || err.message);
      dispatch({ type: "PLACE_ORDER_FAILED", payload: err.response?.data?.message || err.message });
    });
};

export const getAllOrders = () => async (dispatch) => {
    try {
        console.log('Fetching all orders...');
        dispatch({ type: 'GET_ALL_ORDERS_REQUEST' });
        const { data } = await API.get('/api/orders/getallorders');
        console.log('Orders fetched successfully:', data);
        dispatch({ type: 'GET_ALL_ORDERS_SUCCESS', payload: data });
    } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error response:', error.response);
        dispatch({
            type: 'GET_ALL_ORDERS_FAILED',
            payload: error.response?.data?.message || error.message
        });
    }
};
// Mark order as delivered
export const markOrderDelivered = (orderId) => async (dispatch) => {
    try {
        dispatch({ type: 'MARK_ORDER_DELIVERED_REQUEST' });
        const { data } = await API.put(`/api/orders/delivered/${orderId}`);
        dispatch({ type: 'MARK_ORDER_DELIVERED_SUCCESS', payload: data });
        // Refresh orders list after marking as delivered
        dispatch(getAllOrders());
    } catch (error) {
        dispatch({
            type: 'MARK_ORDER_DELIVERED_FAILED',
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get user orders
export const getUserOrders = (userId) => async (dispatch) => {
    try {
        dispatch({ type: 'GET_USER_ORDERS_REQUEST' });
        const { data } = await API.get(`/api/orders/user/${userId}`);
        dispatch({ type: 'GET_USER_ORDERS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'GET_USER_ORDERS_FAILED',
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get order by ID
export const getOrderById = (orderId) => async (dispatch) => {
    try {
        console.log('Fetching order by ID:', orderId);
        dispatch({ type: 'GET_ORDER_BY_ID_REQUEST' });
        const { data } = await API.get(`/api/orders/${orderId}`);
        console.log('Order fetched successfully:', data);
        dispatch({ type: 'GET_ORDER_BY_ID_SUCCESS', payload: data });
    } catch (error) {
        console.error('Error fetching order:', error);
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({
            type: 'GET_ORDER_BY_ID_FAILED',
            payload: errorMessage
        });
        
        // Show user-friendly error
        if (error.response?.status === 404) {
            console.log('Order not found - showing user friendly message');
        } else if (error.response?.status === 400) {
            console.log('Invalid order ID format');
        }
    }
};

// Create a sample order for testing
export const createSampleOrder = () => async (dispatch, getState) => {
    try {
        dispatch({ type: 'CREATE_SAMPLE_ORDER_REQUEST' });
        
        const sampleOrder = {
            currentUser: {
                _id: "sample_user_" + Date.now(),
                name: "Test User",
                email: "test@example.com"
            },
            cartItems: [
                {
                    _id: "sample_product_1",
                    name: "Sample Product 1",
                    quantity: 2,
                    price: 25.99
                },
                {
                    _id: "sample_product_2", 
                    name: "Sample Product 2",
                    quantity: 1,
                    price: 15.50
                }
            ],
            subtotal: 67.48,
            transactionId: "sample_txn_" + Date.now()
        };

        const { data } = await API.post('/api/orders/placeorder', sampleOrder);
        dispatch({ type: 'CREATE_SAMPLE_ORDER_SUCCESS', payload: data });
        
        // Refresh orders list
        dispatch(getAllOrders());
        
        return data.orderId; // Return the created order ID
    } catch (error) {
        console.error('Error creating sample order:', error);
        dispatch({
            type: 'CREATE_SAMPLE_ORDER_FAILED',
            payload: error.response?.data?.message || error.message
        });
    }
};