export const placeOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case 'PLACE_ORDER_REQUEST':
            return {
                loading: true
            };
        case 'PLACE_ORDER_SUCCESS':
            return {
                loading: false,
                success: true
            };
        case 'PLACE_ORDER_FAILED':
            return {
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const getAllOrdersReducer = (state = { orders: [], loading: false }, action) => {
    switch (action.type) {
        case 'GET_ALL_ORDERS_REQUEST':
            return { ...state, loading: true };
        case 'GET_ALL_ORDERS_SUCCESS':
            return { loading: false, orders: action.payload };
        case 'GET_ALL_ORDERS_FAILED':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const markOrderDeliveredReducer = (state = {}, action) => {
    switch (action.type) {
        case 'MARK_ORDER_DELIVERED_REQUEST':
            return { loading: true };
        case 'MARK_ORDER_DELIVERED_SUCCESS':
            return { loading: false, success: true };
        case 'MARK_ORDER_DELIVERED_FAILED':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const getUserOrdersReducer = (state = { orders: [], loading: false }, action) => {
    switch (action.type) {
        case 'GET_USER_ORDERS_REQUEST':
            return { ...state, loading: true };
        case 'GET_USER_ORDERS_SUCCESS':
            return { loading: false, orders: action.payload };
        case 'GET_USER_ORDERS_FAILED':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Get order by ID reducer
export const getOrderByIdReducer = (state = {}, action) => {
    switch (action.type) {
        case 'GET_ORDER_BY_ID_REQUEST':
            return { loading: true };
        case 'GET_ORDER_BY_ID_SUCCESS':
            return { loading: false, order: action.payload };
        case 'GET_ORDER_BY_ID_FAILED':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

// Create sample order reducer
export const createSampleOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CREATE_SAMPLE_ORDER_REQUEST':
            return { loading: true };
        case 'CREATE_SAMPLE_ORDER_SUCCESS':
            return { loading: false, success: true, orderData: action.payload };
        case 'CREATE_SAMPLE_ORDER_FAILED':
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};