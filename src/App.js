import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import ProductList from './components/ProductList';
import CreateProduct from './components/CreateProduct';
import CartPage from './components/CartPage';
import { CartProvider } from './components/CartContext'; // Import the CartProvider

const App = () => {
    return (
        <CartProvider>
            <Router>
                <nav>
                    <Link to="/">Products</Link> | <Link to="/cart">Cart</Link> | <Link to="/createProduk">Create Product</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/createProduk" element={<CreateProduct />} />
                </Routes>
            </Router>
        </CartProvider>
    );
};

export default App;