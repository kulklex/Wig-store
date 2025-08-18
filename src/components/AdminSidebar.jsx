import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaBox,
  FaClipboardList,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";
import { MdCreateNewFolder } from "react-icons/md";
import { MdAssignmentReturn } from "react-icons/md";

const SIDEBAR_WIDTH = 250;

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 m-3 z-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>

      <div
        className={`bg-dark text-white p-3 ${
          isOpen ? "d-block" : "d-none"
        } d-md-block`}
        style={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          position: window.innerWidth < 768 ? "fixed" : "static",
          top: 0,
          left: 0,
          zIndex: 1040,
        }}
      >
        <div className="d-flex justify-content-between align-items-center d-md-none mb-3">
          <h5 className="mb-0">Admin Menu</h5>
          <button className="btn-close btn-close-white" onClick={() => setIsOpen(false)} />
        </div>

        {/* Desktop Navigation */}
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <NavLink
              to="/admin/analytics"
              className="nav-link text-white d-flex align-items-center"
              onClick={handleLinkClick}
            >
              <FaChartBar className="me-2" />
              Analytics
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/create-products"
              className="nav-link text-white d-flex align-items-center"
              onClick={handleLinkClick}
            >
              <MdCreateNewFolder className="me-2" />
              New Product
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/products"
              className="nav-link text-white d-flex align-items-center"
              onClick={handleLinkClick}
            >
              <FaBox className="me-2" />
              Products
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/orders"
              className="nav-link text-white d-flex align-items-center"
              onClick={handleLinkClick}
            >
              <FaClipboardList className="me-2" />
              Orders
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/users"
              className="nav-link text-white d-flex align-items-center"
              onClick={handleLinkClick}
            >
              <FaUsers className="me-2" />
              Users
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/returns"
              className="nav-link text-white d-flex align-items-center"
              onClick={handleLinkClick}
            >
              <MdAssignmentReturn className="me-2" />
              Returns
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
