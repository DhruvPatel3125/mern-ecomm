import axios from "axios";
const initialState = {
    loading: false,
    success: false,
    error: null,
    currentUser: null
};

export const registerNewUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_REGISTER_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'USER_REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                currentUser: action.payload
            };
        case 'USER_REGISTER_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};


export const registerNewUser = (user) => async (dispatch) => {
    dispatch({ type: "USER_REGISTER_REQUEST" });
    try {
        const response = await axios.post("/api/users/register", user);
        dispatch({ type: "USER_REGISTER_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "USER_REGISTER_FAILED", payload: error.message });
    }
};

export const loginUser = (user) => async (dispatch) => {
    dispatch({ type: "USER_LOGIN_REQUEST" });
    try {
        const response = await axios.post("/api/users/login", user);
        dispatch({ type: "USER_LOGIN_SUCCESS", payload: response.data });
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        window.location.href = "/";
    } catch (error) {
        dispatch({ type: "USER_LOGIN_FAILED", payload: error.message });
    }
};

export const loginUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOGIN_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'USER_LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                currentUser: action.payload
            };
        case 'USER_LOGIN_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case 'USER_LOGOUT': return{
            ...state
        }
        default:
            return state;
    }
};