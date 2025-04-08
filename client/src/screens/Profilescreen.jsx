import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../actions/userAction";
import Error from "../components/Error";
import Loader from "../components/Loader";
import Success from "../components/Success";

export default function Profilescreen() {
    const loginstate = useSelector((state) => state.loginUserReducer);
    const updatestate = useSelector((state) => state.updateReducer || {});
    
    const { loading = false, error = null, success = false } = updatestate;
    const currentUser = loginstate?.currentUser;
    const dispatch = useDispatch();
    
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function handleUpdate(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        const updatedUser = {
            name: name,
            email: email,
            password: password
        };

        dispatch(updateUser(updatedUser, currentUser._id));
    }

    useEffect(() => {
        if (!currentUser) {
            window.location.href = '/login';
        }
    }, [currentUser]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 card p-5">
                    <div className="div">
                        <h2 className="text-center mb-4">Update Profile</h2>
                        
                        {loading && <Loader />}
                        {error && <Error error={error} />}
                        {success && <Success message="Profile Updated Successfully!" />}

                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button 
                                className="btn w-100" 
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
