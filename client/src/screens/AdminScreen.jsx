import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import UsersList from './UsersList';
import ProductLists from './ProductLists';
import AddNewProduct from './AddProduct';
import OrdersList from './OrdersList';

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
        <div>
            <div className="row justify-content-center mt-5"> 
                <div className="col-md-10">
                    <div className="admin-menu">
                        <ul className='admin p-2' style={{ listStyleType: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/admin/userslist" className={`admin-link ${location.pathname.includes('/admin/userslist') ? 'active' : ''}`}>
                                    Users List
                                </Link>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/admin/productslist" className={`admin-link ${location.pathname.includes('/admin/productslist') ? 'active' : ''}`}>
                                    Products List
                                </Link>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/admin/addnewproduct" className={`admin-link ${location.pathname.includes('/admin/addnewproduct') ? 'active' : ''}`}>
                                    Add New Product
                                </Link>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/admin/orderslist" className={`admin-link ${location.pathname.includes('/admin/orderslist') ? 'active' : ''}`}>
                                    Orders List
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="admin-content mt-4">
                        <Routes>
                            <Route path="/" element={<UsersList />} />
                            <Route path="userslist" element={<UsersList />} />
                            <Route path="productslist" element={<ProductLists />} />
                            <Route path="addnewproduct" element={<AddNewProduct />} />
                            <Route path="orderslist" element={<OrdersList />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}
