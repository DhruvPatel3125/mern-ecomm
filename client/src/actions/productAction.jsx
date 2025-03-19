import axios from "axios";

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "GET_PRODUCTS_REQUEST" });
    const response = await axios.get("/api/products/getallproducts");
    dispatch({ type: "GET_PRODUCTS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "GET_PRODUCTS_FAILED", payload: error.message });
  }
};

export const getProductById = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "GET_PRODUCT_REQUEST" });
    const response = await axios.get(`/api/products/getproductbyid/${productId}`);
    dispatch({ type: "GET_PRODUCT_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "GET_PRODUCT_FAILED", payload: error.message });
  }
};

export const addtocart = (product, quantity) => (dispatch, getState) => {
  const cartItem = {
    name: product.name,
    _id: product._id,
    image: product.image,
    price: product.price,
    countInStock: product.countInStock,
    quantity: quantity,
  };

  const cartItems = getState().addtoCartReducer.cartItems;
  const existItem = cartItems.find((x) => x._id === cartItem._id);

  if (existItem) {
    dispatch({
      type: "ADD_TO_CART",
      payload: cartItems.map((x) =>
        x._id === existItem._id ? { ...x, quantity: x.quantity + quantity } : x
      ),
    });
  } else {
    dispatch({
      type: "ADD_TO_CART",
      payload: [...cartItems, cartItem],
    });
  }

  localStorage.setItem("cartItems", JSON.stringify(getState().addtoCartReducer.cartItems));
};

export const filterProducts = (searchkey, shortKey, category) => (dispatch) => {
  dispatch({ type: 'GET_PRODUCTS_REQUEST' });
  axios.get('/api/products/getallproducts').then((res) => {
    let filteredproducts = res.data;

    if (searchkey) {
      filteredproducts = filteredproducts.filter((product) =>
        product.name.toLowerCase().includes(searchkey)
      );
    }
    if (shortKey !== 'popular') {
      if (shortKey === 'htl') {
        filteredproducts = filteredproducts.sort((a, b) => b.price - a.price);
      } else {
        filteredproducts = filteredproducts.sort((a, b) => a.price - b.price);
      }
    }
    if (category !== 'all') {
      filteredproducts = filteredproducts.filter((product) =>
        product.category.toLowerCase().includes(category)
      );
    }
    dispatch({ type: 'GET_PRODUCTS_SUCCESS', payload: filteredproducts });
  }).catch((err) => {
    dispatch({ type: 'GET_PRODUCTS_FAILED' });
  });
};
//8-17