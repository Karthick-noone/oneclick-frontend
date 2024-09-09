// src/index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CartProvider } from './components/CartContext';

ReactDOM.render(
  <CartProvider>
    <App />
  </CartProvider>,
  document.getElementById('root')
);
