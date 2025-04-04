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
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/product/:id" element={<ProductDescription />} />
          <Route path="/cart" element={<Cartscreen />} />
          <Route path="/register" element={<Registerscreen />} />
          <Route path="/login" element={<Loginscreen />} />
          <Route path="/orders" element={<OrderScreen />} />
          <Route path="/profile" element={<Profilescreen />} />
          <Route path="/admin" element={<AdminScreen />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
