import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UsersList from './UsersList';
import ProductLists from './ProductLists';
import AddNewProduct from './AddProduct';
import OrdersList from './OrdersList';

export default function AdminScreen() {
    return (
        <div>
            <div className="row justify-content-center mt-5"> 
                <div className="col-md-10">
                    <ul className='admin p-2' style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/admin/userslist" style={{ textDecoration: 'none', color: 'black' }}>Users List</Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/admin/productslist" style={{ textDecoration: 'none', color: 'black' }}>Products List</Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/admin/addnewproduct" style={{ textDecoration: 'none', color: 'black' }}>Add New Product</Link>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <Link to="/admin/orderslist" style={{ textDecoration: 'none', color: 'black' }}>Orders List</Link>
                        </li>
                    </ul>

                    <Routes>
                        <Route path="userslist" element={<UsersList />} />
                        <Route path="productslist" element={<ProductLists />} />
                        <Route path="addnewproduct" element={<AddNewProduct />} />
                        <Route path="orderslist" element={<OrdersList />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
