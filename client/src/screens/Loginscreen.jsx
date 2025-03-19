import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../actions/userAction";
import Error from "../components/Error";
import Loader from "../components/Loader";

export default function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const loginState = useSelector(state => state.loginUserReducer);
  const { loading, error, success } = loginState;

  const login = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    dispatch(loginUser(user));
  };
  
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      window.location.href = "/";
    }
  }, []);
  
  return (
    <div className="container auth-container">
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-md-4 card auth-card">
          <div className="div">
            <h2 className="auth-title">Login</h2>
            {error && (<Error error={error} />)}
            <form className="auth-form" onSubmit={login}>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <button
                  className="btn"
                  type="submit"
                  disabled={loading}
                >
                  Login
                </button>
              </div>
              {success && <div className="success-message">Login successful!</div>}
            </form>
          </div>
          <a href="/register" className="auth-link">Click Here To Register</a>
        </div>
      </div>
    </div>
  );
}

