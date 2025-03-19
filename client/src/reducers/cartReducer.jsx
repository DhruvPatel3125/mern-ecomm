const initialCartState = {
  cartItems: JSON.parse(localStorage.getItem("cartItems")) || []
};

export const cartReducer = (state = initialCartState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cartItems: action.payload,
      };
    case "DELETE_FROM_CART":
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
};

export default cartReducer;
