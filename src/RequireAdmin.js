import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return <div className="text-center p-5">Checking admin access...</div>;
  }

  // Not logged in or not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
