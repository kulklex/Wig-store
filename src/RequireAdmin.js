import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const { user, loading } = useSelector((state) => state.user);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      const timer = setTimeout(() => setRedirect(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (loading) {
    return <div className="text-center p-5">Checking admin access...</div>;
  }

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  if (!user || user.role !== "admin") {
    return <div className="text-center p-5">Checking admin access...</div>;
  }

  return children;
};

export default RequireAdmin;
