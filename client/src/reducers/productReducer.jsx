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

const initialSingleProductState = {
  product: null,
  loading: false,
  error: null
};

export const getProductByIdReducer = (state = initialSingleProductState, action) => {
  switch (action.type) {
    case "GET_PRODUCT_REQUEST":
      return { ...state, loading: true, error: null };
    case "GET_PRODUCT_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "GET_PRODUCT_FAILED":
      return { ...state, loading: false, error: action.payload };
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