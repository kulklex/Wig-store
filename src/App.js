import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode'
import { clearUser, setUser } from './redux/authSlice';
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
import AdminCreateProduct from "./admin/AdminCreateProduct";
import AdminProductsPage from "./admin/AdminProductsPage";
import AdminEditProduct from "./admin/AdminEditProduct";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import AdminUpdateOrderStatus from './admin/AdminUpdateOrderStatus';
import AdminOrdersPage from './admin/AdminOrdersPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminLayout from "./layouts/AdminLayout";
import RequireAdmin from './RequireAdmin';
import AdminAnalytics from './admin/AdminAnalytics';
import OrderDetails from './pages/OrderDetails';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation()

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);

    try {
      const decoded = jwtDecode(user.token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        dispatch(setUser(user));
      } else {
        localStorage.removeItem('user');
        dispatch(clearUser());
      }
    } catch (err) {
      localStorage.removeItem('user');
      dispatch(clearUser());
    }
  }
}, [dispatch]);


const adminRoutes = [
  "/admin/manage",
  "/admin/products",
  "/admin/edit-product/:id",
  "/admin/create-products",
  "/admin/orders",
  "/admin/users",
  "/admin/orders/:id",
  "/admin/analytics"
];

const isAdminRoute = adminRoutes.some((route) =>
  location.pathname.startsWith(route.replace(/:.*$/, ""))
);

const hideNavbar = isAdminRoute;
const hideFooter = isAdminRoute;

// const hideFooterRoutes = [ "/sign-in" ];
//   const hideNavbarRoutes = ["/admin/manage",];
//   const hideFooter = hideFooterRoutes.includes(location.pathname);
//   const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop/*" element={<h1>Shop</h1>} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/contact" element={<h1>Contact</h1>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/sign-in" element={<GoogleLogin />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          
          {/* Admin routes (wrapped in RequireAdmin + AdminLayout) */}
        <Route
          path="/admin/products"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/create-products"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminCreateProduct />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminEditProduct />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminOrdersPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminUpdateOrderStatus />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminUsersPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <RequireAdmin>
              <AdminLayout>
                <AdminAnalytics />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
