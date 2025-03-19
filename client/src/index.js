import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Make sure this file exists, or remove this line
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

// Ensure reportWebVitals exists, or remove it
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// Optional performance reporting
reportWebVitals();
