import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { clearUser, setUser } from "./redux/authSlice";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AdminUpdateOrderStatus from "./admin/AdminUpdateOrderStatus";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import AdminUsersPage from "./admin/AdminUsersPage";
import AdminLayout from "./layouts/AdminLayout";
import RequireAdmin from "./RequireAdmin";
import AdminAnalytics from "./admin/AdminAnalytics";
import OrderDetails from "./pages/OrderDetails";
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs";
import MissionStatement from "./pages/MissionStatement";
import FAQs from "./pages/FAQs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import ShippingDeliver from "./pages/Shippping";
import ContactUs from "./pages/ContactUs";
import TrackingScripts from "./components/TrackingScripts";
import CookieBanner from "./components/CookieBanner";
import ReturnSelectItems from "./pages/ReturnSelectedItems";
import ReturnForm from "./pages/ReturnForm";
import AdminReturnsList from "./admin/AdminReturnsList";
import AdminReturnDetails from "./admin/AdminReturnDetails";
import Wishlist from "./pages/Wishlist";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);

      try {
        const decoded = jwtDecode(user.token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          dispatch(setUser(user));
        } else {
          localStorage.removeItem("user");
          dispatch(clearUser());
        }
      } catch (err) {
        localStorage.removeItem("user");
        dispatch(clearUser());
      }
    }
  }, [dispatch]);

  const adminRoutes = [
    "/admin/returns",
    "/admin/products",
    "/admin/edit-product/:id",
    "/admin/create-products",
    "/admin/orders",
    "/admin/users",
    "/admin/orders/:id",
    "/admin/analytics",
  ];

  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route.replace(/:.*$/, ""))
  );

  const hideNavbar = isAdminRoute;
  const hideFooter = isAdminRoute || location.pathname === "/sign-in";


  return (
    <div className="d-flex flex-col min-vh-100">
      {!hideNavbar && <Navbar />}
      <ScrollToTop />
      <main className="flex-grow">
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/mission-statement" element={<MissionStatement />} />
          <Route path="/returns-and-refunds" element={<ReturnsPolicy />} />
          <Route path="/shipping" element={<ShippingDeliver />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<h1><ContactUs /></h1>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/sign-in" element={<GoogleLogin />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order/:id/return" element={<ReturnSelectItems />} />
          <Route path="/order/:id/return/form" element={<ReturnForm />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
               <Navigate to="/admin/analytics" replace />
              </RequireAdmin>
            }
          />
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
          <Route
            path="/admin/returns"
            element={
              <RequireAdmin>
                <AdminLayout>
                  <AdminReturnsList/>
                </AdminLayout>
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/returns/:id"
            element={
              <RequireAdmin>
                <AdminLayout>
                  <AdminReturnDetails/>
                </AdminLayout>
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <TrackingScripts />
      <CookieBanner />
    </div>
  );
};

export default App;
