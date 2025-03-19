import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerNewUser } from "../actions/userAction";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";

export default function Registerscreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const registerState = useSelector((state) => state.registerNewUserReducer);
  const { loading, error, success } = registerState;

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const user = {
      name,
      email,
      password,
    };
    dispatch(registerNewUser(user));
  };

  return (
    <div className="container auth-container">
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Loader />
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-md-5 card auth-card">
          <div className="div">
            <h2 className="auth-title">Register</h2>
            {error && <Error error="You already have an account please login" />}
            {success && (
              <div className="alert alert-success" role="alert">
                Registration successful!
              </div>
            )}
            <form className="auth-form" onSubmit={handleRegister}>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <button
                  className="btn"
                  type="submit"
                  disabled={loading}
                >
                  Register
                </button>
              </div>
            </form>
            <a href="/login" className="auth-link">Click Here To Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
