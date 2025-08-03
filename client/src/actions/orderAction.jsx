import axios from "axios";
export const placeholder = (token, subtotal) => (dispatch, getState) => {
  const currentUser = getState().loginReduces.currentUser;
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

  axios.post("/api/orders/placeorder", { token, subtotal, currentUser, cartItems })
    .then((res) => {
      dispatch({ type: "PLACE_ORDER_SUCCESS" });
      console.log(res)
    })
    .catch((err) => {
      dispatch({ type: "PLACE_ORDER_FAILED" });
    });
};

export const getAllOrders = () => async (dispatch) => {
    try {
        console.log('Fetching all orders...');
        dispatch({ type: 'GET_ALL_ORDERS_REQUEST' });
        const { data } = await axios.get('/api/orders/getallorders');
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
        const { data } = await axios.put(`/api/orders/delivered/${orderId}`);
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
        const { data } = await axios.get(`/api/orders/user/${userId}`);
        dispatch({ type: 'GET_USER_ORDERS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({
            type: 'GET_USER_ORDERS_FAILED',
            payload: error.response?.data?.message || error.message
        });
    }
};

//order details