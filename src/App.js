import React from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import "./App.css"
import Home from './pages/Home';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import SearchResults from './pages/SearchResults';
import ProductPage from './pages/ProductPage';
import GoogleLogin from './pages/GoogleLogin';
import ErrorPage from './pages/ErrorPage';
import Checkout from './pages/Checkout';

const App = () => {
  const location = useLocation();
  const hideFooterRoutes = ['/cart', '/sign-in',];
  const hideNavbarRoutes = ['',];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
      <>
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/*" element={<h1>Shop</h1>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductPage /> } />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<ErrorPage />} /> 
        <Route path="/sign-in" element={<GoogleLogin />} />
      </Routes>
      </main>
      {!hideFooter && <Footer />}
      </>
  );
};

export default App;