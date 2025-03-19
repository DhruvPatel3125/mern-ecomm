import axios from "axios";

export const addtocart = (product, quantity) => (dispatch, getState) => {
  try {
    console.log("Adding to cart:", product, quantity);
    console.log("Current state:", getState());

    const cartItem = {
      name: product.name,
      _id: product._id,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      quantity: quantity,
    };

    // Initialize with empty array if cartReducer or cartItems doesn't exist
    const currentState = getState();
    const cartItems = currentState.cartReducer?.cartItems || [];
    
    console.log("Current cart items:", cartItems);
    
    const existItem = cartItems.find((x) => x._id === cartItem._id);

    if (existItem) {
      // Update the quantity of the existing item
      dispatch({
        type: "ADD_TO_CART",
        payload: cartItems.map((x) =>
          x._id === existItem._id ? { ...x, quantity: quantity } : x
        ),
      });
    } else {
      // Add new item to the cart
      dispatch({
        type: "ADD_TO_CART",
        payload: [...cartItems, cartItem],
      });
    }

    // Save to localStorage after state update
    const updatedState = getState();
    const updatedCartItems = updatedState.cartReducer?.cartItems || [];
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  } catch (error) {
    console.error("Error in addtocart action:", error);
  }
};

export const deleteFromCart = (productId) => (dispatch, getState) => {
  try {
    const currentState = getState();
    const cartItems = currentState.cartReducer?.cartItems || [];
    
    const updatedCartItems = cartItems.filter((item) => item._id !== productId);

    dispatch({
      type: "DELETE_FROM_CART",
      payload: updatedCartItems,
    });

    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  } catch (error) {
    console.error("Error in deleteFromCart action:", error);
  }
};

