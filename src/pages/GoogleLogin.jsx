import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import AlertModal from "../components/AlertModal";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
          width: 250,
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCredentialResponse = async (response) => {
    const credential = response.credential;

    try {
      const res = await axios.post(
        "/api/auth/google-login",
        { credential },
        { withCredentials: true }
      );

      const user = res.data.user;

      const token = res.data.token || null; 
      const userWithToken = token ? { ...user, token } : user;

      dispatch(setUser(userWithToken));
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Google login failed:", err);
      setModalMessage(
        err?.response?.data?.message || "Google login failed. Please try again."
      );
      setShowModal(true);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-3">
      <div className="row justify-content-center pt-5">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 rounded-4">
           <div className="text-center mb-4">
              <h2 className="fw-bold text-dark mb-2"> <span className="text-dark">KarinaBeautyHub</span></h2>
              <p className="text-muted small">Sign in with your Google account to continue</p>
            </div>

            <div id="google-signin-btn" className="w-100 mb-3 d-flex align-content-center justify-content-center text-center"></div>

            <hr className="my-4" />

            <p className="text-center text-muted small mb-0">
              By continuing, you agree to our
              <Link to="#" className="text-decoration-none mx-1">
                Terms
              </Link>
              and
              <Link to="#" className="text-decoration-none mx-1">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <AlertModal
          isOpen={showModal}
          title="Login Error"
          message={modalMessage}
          onClose={() => setShowModal(false)}
          onConfirm={() => setShowModal(false)}
          confirmText="OK"
          cancelText=""
        />
      </div>
    </div>
  );
};

export default GoogleLogin;
