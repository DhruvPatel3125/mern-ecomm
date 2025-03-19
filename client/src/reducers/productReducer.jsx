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
  