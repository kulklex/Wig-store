import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '80vh' }}>
      <h1 className="display-1 text-dark fw-bold">404</h1>
      <p className="fs-4 mb-4">Oops! The page you're looking for doesn't exist.</p>
      <button className="btn btn-dark px-4 py-2" onClick={() => navigate('/')}>
        Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
