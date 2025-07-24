import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../redux/authSlice';

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
        }
      );
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    const credential = response.credential;

    try {
      const res = await axios.post(
        '/api/auth/google-login',
        { credential },
        { withCredentials: true }
      );
      dispatch(setUser(res.data.user));
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 px-3">
      <div className="row justify-content-center pt-5">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 rounded-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark mb-2"> <span className="text-primary">KarinaHair</span></h2>
              <p className="text-muted small">Sign in with your Google account to continue</p>
            </div>

            <div id="google-signin-btn" className="w-100 mb-3"></div>

            <hr className="my-4" />

            <p className="text-center text-muted small mb-0">
              By continuing, you agree to our
              <Link to="#" className="text-decoration-none mx-1">Terms</Link> and
              <Link to="#" className="text-decoration-none mx-1">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;
