import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import UsersList from './UsersList';
import ProductLists from './ProductLists';
import AddNewProduct from './AddProduct';
import OrdersList from './OrdersList';
import Editproduct from './Editproduct';
import './AdminScreen.css';

export default function AdminScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to users list if we're at /admin
    React.useEffect(() => {
        if (location.pathname === '/admin') {
            navigate('/admin/userslist');
        }
    }, [location, navigate]);

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <div className="admin-sidebar">
                    <div className="admin-logo">
                        <h2>Admin Panel</h2>
                    </div>
                    <ul className="admin-menu">
                        <li>
                            <Link to="/admin/userslist" className={`admin-menu-item ${location.pathname.includes('/admin/userslist') ? 'active' : ''}`}>
                                <i className="fas fa-users"></i>
                                <span>Users List</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/productslist" className={`admin-menu-item ${location.pathname.includes('/admin/productslist') ? 'active' : ''}`}>
                                <i className="fas fa-box"></i>
                                <span>Products List</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/addnewproduct" className={`admin-menu-item ${location.pathname.includes('/admin/addnewproduct') ? 'active' : ''}`}>
                                <i className="fas fa-plus-circle"></i>
                                <span>Add Product</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/orderslist" className={`admin-menu-item ${location.pathname.includes('/admin/orderslist') ? 'active' : ''}`}>
                                <i className="fas fa-shopping-cart"></i>
                                <span>Orders List</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="admin-main-content">
        
                    <div className="admin-content">
                        <Routes>
                            <Route path="/" element={<UsersList />} />
                            <Route path="userslist" element={<UsersList />} />
                            <Route path="productslist" element={<ProductLists />} />
                            <Route path="addnewproduct" element={<AddNewProduct />} />
                            <Route path="orderslist" element={<OrdersList />} />
                            <Route path="*" element={<h2>404 Not Found</h2>} />
                            <Route path="editproduct/:product" element={<Editproduct />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}
