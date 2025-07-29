import React from "react";
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4" style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
