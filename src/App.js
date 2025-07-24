import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser, clearUser } from './redux/authSlice';
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import SearchResults from "./pages/SearchResults";
import ProductPage from "./pages/ProductPage";
import GoogleLogin from "./pages/GoogleLogin";
import ErrorPage from "./pages/ErrorPage";
import Checkout from "./pages/Checkout";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import AdminProductList from "./components/AdminProductList";
import AdminEditProduct from "./pages/AdminEditProduct";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get('/api/auth/me', { withCredentials: true });
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(clearUser());
      }
    };

    checkSession();
  }, [dispatch]);
  
  const location = useLocation();
  const hideFooterRoutes = [
    "/cart",
    "/sign-in",
    "*",
    "/admin/manage-products",
    "/admin/create-products",
  ];
  const hideNavbarRoutes = ["/admin/manage-products", "/admin/create-products"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/*" element={<h1>Shop</h1>} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/contact" element={<h1>Contact</h1>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/sign-in" element={<GoogleLogin />} />
          <Route path="/admin/create-products" element={<AdminCreateProduct />} />
          <Route path="/admin/manage-products" element={<AdminProductList />} />
          <Route path="/admin/edit-product/:id" element={<AdminEditProduct />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
