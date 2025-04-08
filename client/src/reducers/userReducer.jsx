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

export const updateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_UPDATE_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'USER_UPDATE_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                currentUser: action.payload
            };
        case 'USER_UPDATE_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const getAllusersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ALLUSERS_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'GET_ALLUSERS_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                users: action.payload
            };
        case 'GET_ALLUSERS_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const getAllUsers = () => async (dispatch) => {
    dispatch({ type: "GET_ALLUSERS_REQUEST" });
    try {
        const { data } = await axios.get("/api/users/getallusers");
        dispatch({ type: "GET_ALLUSERS_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "GET_ALLUSERS_FAILED", payload: error.message });
    }
};

export const deleteUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DELETE_USER_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'DELETE_USER_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true
            };
        case 'DELETE_USER_FAILED':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export const deleteUser = (userId) => async (dispatch) => {
    dispatch({ type: "DELETE_USER_REQUEST" });
    try {
        await axios.delete(`/api/users/${userId}`);
        dispatch({ type: "DELETE_USER_SUCCESS" });
    } catch (error) {
        dispatch({ type: "DELETE_USER_FAILED", payload: error.message });
    }
};