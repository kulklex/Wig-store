import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
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
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, []);

const handleCredentialResponse = async (response) => {
  const credential = response.credential;

  try {
    const res = await axios.post('/api/auth/google-login', { credential }, { withCredentials: true });

    dispatch(setUser(res.data.user));
    navigate(from, { replace: true });
  } catch (err) {
    console.error(err);
    alert('Google login failed');
  }
};


  return <>
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign in with Google</h2>
        <div id="google-signin-btn" className="d-flex justify-content-center"></div>
      </div>
    </div>
  </>
};

export default GoogleLogin;
