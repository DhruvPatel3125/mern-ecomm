import axios from "axios";

const API = axios.create({ 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/' 
});

export const registerNewUser = (user) => async (dispatch) => {
    dispatch({ type: "USER_REGISTER_REQUEST" });
    try {
        const response = await API.post("/api/users/register", user);
        dispatch({ type: "USER_REGISTER_SUCCESS", payload: response.data });
    } catch (error) {
        dispatch({ type: "USER_REGISTER_FAILED", payload: error.response?.data?.message || error.message });
    }
};

export const loginUser = (user) => async (dispatch) => {
    dispatch({ type: "USER_LOGIN_REQUEST" });
    try {
        const response = await API.post("/api/users/login", user);
        dispatch({ type: "USER_LOGIN_SUCCESS", payload: response.data });
        localStorage.setItem("currentUser", JSON.stringify(response.data));
        window.location.href = "/";
    } catch (error) {
        dispatch({ type: "USER_LOGIN_FAILED", payload: error.response?.data?.message || error.message });
    }
};

export const logoutUser = () => async (dispatch) => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cartItems');
    dispatch({ type: 'USER_LOGOUT' });
    window.location.href = '/login';
};

export const updateUser = (updatedUser, userId) => async (dispatch) => {
    try {
        dispatch({ type: 'USER_UPDATE_REQUEST' });

        const response = await API.post('/api/users/update', {
            updatedUser,
            userId
        });

        dispatch({ type: 'USER_UPDATE_SUCCESS' });
        
        // Update the currentUser in localStorage and state
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const updatedCurrentUser = {
            ...currentUser,
            name: updatedUser.name,
            email: updatedUser.email
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        
        dispatch({ type: 'USER_LOGIN_SUCCESS', payload: updatedCurrentUser });

        // Show success message
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        dispatch({
            type: 'USER_UPDATE_FAILED',
            payload: error.response?.data?.message || error.message
        });
    }
};

export const getAllUser = () => async (dispatch) => {
    try {
        dispatch({type:'GET_ALLUSERS_REQUEST'});
        const response = await API.get('/api/users/getallusers');
        dispatch({type:"GET_ALLUSERS_SUCCESS", payload: response.data});
    } catch (error) {
        dispatch({type:'GET_ALLUSERS_FAILED', payload: error.response?.data?.message || error.message});
    }
};