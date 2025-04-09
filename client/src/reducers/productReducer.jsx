import axios from 'axios';

const initialProductState = {
  products: [],
  loading: false,
  error: null
};

export const getAllProductsReducer = (state = initialProductState, action) => {
  switch (action.type) {
    case "GET_PRODUCTS_REQUEST":
      return { ...state, loading: true, error: null };
    case "GET_PRODUCTS_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "GET_PRODUCTS_FAILED":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getAllProducts = () => async (dispatch) => {
  dispatch({ type: "GET_PRODUCTS_REQUEST" });
  try {
    const { data } = await axios.get("/api/products/getallproducts");
    dispatch({ type: "GET_PRODUCTS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "GET_PRODUCTS_FAILED", payload: error.message });
  }
};

const initialSingleProductState = {
  product: null,
  loading: false,
  error: null
};

export const getProductByIdReducer = (state = { loading: true, product: null }, action) => {
  switch (action.type) {
    case "GET_PRODUCT_REQUEST":
      return { ...state, loading: true };
    case "GET_PRODUCT_SUCCESS":
      return { loading: false, product: action.payload };
    case "GET_PRODUCT_FAILED":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
  

export const addproductReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT_REVIEW_REQUEST':
      return {
        loading: true // Fix typo 'loding'
      }
    case 'ADD_PRODUCT_REVIEW_SUCCESS':
      return {
        loading: false,
        success: true
      }
    case 'ADD_PRODUCT_REVIEW_FAILED': // Fix wrong action type
      return {
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
};

export const reviewActionReducer = (state = {}, action) => {
    switch (action.type) {
        case 'EDIT_REVIEW_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'EDIT_REVIEW_SUCCESS':
            return {
                loading: false,
                success: true
            };
        case 'EDIT_REVIEW_FAILED':
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const deleteProductReducer = (state = {}, action) => {
    switch (action.type) {
        case 'DELETE_PRODUCT_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                loading: false,
                success: true
            };
        case 'DELETE_PRODUCT_FAILED':
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const deleteProduct = (productId) => async (dispatch) => {
    dispatch({ type: 'DELETE_PRODUCT_REQUEST' });
    try {
        await axios.delete(`/api/products/${productId}`);
        dispatch({ type: 'DELETE_PRODUCT_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'DELETE_PRODUCT_FAILED', payload: error.message });
    }
};

export const addProductReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_PRODUCT_REQUEST':
            return { loading: true };
        case 'ADD_PRODUCT_SUCCESS':
            return { loading: false, success: true, product: action.payload };
        case 'ADD_PRODUCT_FAILED':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const updateProductReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case 'UPDATE_PRODUCT_REQUEST':
      return { loading: true };
    case 'UPDATE_PRODUCT_SUCCESS':
      return { loading: false, success: true };
    case 'UPDATE_PRODUCT_FAILED':
      return { loading: false, error: action.payload };
    case 'UPDATE_PRODUCT_RESET':
      return { loading: false };
    default:
      return state;
  }
};

export const updateProduct = (productId, productData) => async (dispatch) => {
  try {
    dispatch({ type: 'UPDATE_PRODUCT_REQUEST' });
    const { data } = await axios.put(`/api/products/update/${productId}`, productData);
    dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: data });
  } catch (error) {
    dispatch({
      type: 'UPDATE_PRODUCT_FAILED',
      payload: error.response?.data?.message || error.message
    });
  }
};