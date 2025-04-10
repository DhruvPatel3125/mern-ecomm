import { createStore, applyMiddleware, combineReducers } from "redux";
import {thunk} from "redux-thunk";
import { composeWithDevTools } from '@redux-devtools/extension';
import { getAllProductsReducer, getProductByIdReducer, addproductReviewReducer, 
         reviewActionReducer, deleteProductReducer, addProductReducer, updateProductReducer } from "./reducers/productReducer";
import { cartReducer } from "./reducers/cartReducer";
import { loginUserReducer, registerNewUserReducer, updateReducer, getAllusersReducer, deleteUserReducer } from "./reducers/userReducer";
import { placeOrderReducer, getAllOrdersReducer } from "./reducers/orderReducer";

const finalReducer = combineReducers({
  allProducts: getAllProductsReducer,
  getProductByIdReducer: getProductByIdReducer,
  cartReducer: cartReducer,
  registerNewUserReducer: registerNewUserReducer,
  loginUserReducer: loginUserReducer,
  placeOrderReducer: placeOrderReducer,
  addproductReviewReducer: addproductReviewReducer,
  reviewAction: reviewActionReducer,
  updateReducer: updateReducer,
  getAllUsers: getAllusersReducer,
  deleteUser: deleteUserReducer,
  deleteProduct: deleteProductReducer,
  addProductReducer: addProductReducer,
  updateProductReducer: updateProductReducer,
  getAllOrders: getAllOrdersReducer
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];
const currentUser = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
  : null;

const initialState = {
  cartReducer: {
    cartItems: cartItemsFromStorage
  },
  loginUserReducer: {
    currentUser: currentUser
  }
};

const store = createStore(
  finalReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
