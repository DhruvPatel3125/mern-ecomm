import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../actions/userAction";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const cartReducerState = useSelector((state) => state.cartReducer);
  const cartItems = cartReducerState?.cartItems || [];
  const loginState = useSelector((state) => state.loginUserReducer);
  const currentUser = loginState?.currentUser;
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-text">SHAY SHOP</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} 
                to="/products"
              >
                Products
              </Link>
            </li>
            
            {currentUser ? (
              <li className="nav-item dropdown">
                <div
                  className="nav-link dropdown-toggle user-dropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {currentUser.name}
                </div>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="fas fa-box me-2"></i>Orders
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                  to="/login"
                >
                  <i className="fas fa-sign-in-alt me-1"></i>Login
                </Link>
              </li>
            )}
            
            <li className="nav-item">
              <Link 
                className={`nav-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
                to="/cart"
              >
                <div className="cart-icon-container">
                  <i className="fas fa-shopping-cart"></i>
                  {cartItems.length > 0 && (
                    <span className="cart-badge">{cartItems.length}</span>
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
