import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homrscreen';
import ProductDescription from './screens/ProductDescription';
import Cartscreen from './screens/Cartscreen';
import Registerscreen from './screens/Registerscreen';
import Loginscreen from './screens/Loginscreen';
import OrderScreen from './screens/OrderScreen';
import Profilescreen from './screens/Profilescreen';
import AdminScreen from './screens/AdminScreen';
import Editproduct from './screens/Editproduct';
import UserOrdersScreen from './screens/UserOrdersScreen';
import ProductsPage from './screens/ProductsPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/product/:id" element={<ProductDescription />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<Cartscreen />} />
          <Route path="/register" element={<Registerscreen />} />
          <Route path="/login" element={<Loginscreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/profile" element={<Profilescreen />} />
          <Route path="/orders" element={<UserOrdersScreen />} />
          <Route path="/admin/*" element={<AdminScreen />}>
            <Route path="editproduct/:productid" element={<Editproduct />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
// this is thr way for 