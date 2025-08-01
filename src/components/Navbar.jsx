import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { closeCartDrawer, getTotals, openCartDrawer } from "../redux/cartSlice";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ PRODUCTS: true });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);
  const showCartDrawer = useSelector((state) => state.cart.showDrawer);

  const dropdownTimeoutRef = useRef(null);
  const infoDropdownTimeoutRef = useRef(null);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setShowShopDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowShopDropdown(false);
    }, 200);
  };

  const handleInfoDropdownEnter = () => {
    if (infoDropdownTimeoutRef.current) {
      clearTimeout(infoDropdownTimeoutRef.current);
    }
    setShowInfoDropdown(true);
  };

  const handleInfoDropdownLeave = () => {
    infoDropdownTimeoutRef.current = setTimeout(() => {
      setShowInfoDropdown(false);
    }, 200);
  };

  useEffect(() => {
    dispatch(closeCartDrawer());
    setHasMounted(true);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const dropdownContent = [
    {
      title: "PRODUCTS",
      items: [
        "Raw Bundles",
        "Frontals",
        "Closures",
        "Wigs",
        "Microlinks & I-Tips",
        "Tape Ins",
        "Clip Ins",
        "Ponytails",
        "Accessories",
        "Adhesives & Styling",
      ],
    },
    {
      title: "TEXTURE",
      items: [
        "Straight",
        "Bodywave",
        "Luxe Curl (Deep Wave)",
        "Loose Wave",
        "Loose Curls (Water Wave)",
        "Kinky Curly",
        "Yaki Straight",
        "Kinky Straight",
        "Vietnamese (DD) Straight",
        "Cambodian (DD) Wavy",
        "Burmese (DD) Curly",
      ],
    },
    {
      title: "LACE SIZE",
      items: [
        "2x6 Closures",
        "4x4 Closures",
        "5x5 Closures",
        "6x6 Closures",
        "7x7 Closures",
        "9x6 Closures",
        "13x4 Frontals",
        "13x6 Frontals",
        "360 Frontals",
        "Full Lace",
        "U-Part",
        "Headband",
        "Half Wig",
      ],
    },
    {
      title: "LACE TYPE",
      items: ["HD Thin Lace", "Transparent Swiss Lace", "Brown Swiss Lace"],
    },
    {
      title: "COLOR",
      items: ["#18 Raw Hair", "#613 Virgin Blonde"],
    },
  ];

  const infoLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "FAQs", to: "/faqs" },
    { label: "Help", to: "/help" },
    { label: "Shipping & Returns", to: "/shipping-returns" },
  ];

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white d-flex py-3 position-relative d-none d-lg-block">
        <div className="d-flex align-items-center justify-content-between position-relative px-4">
          {/* Left Side */}
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex justify-items-center align-items-center text-center">
              {user?.role === "admin" && (
                <Link
                  to="/admin/analytics"
                  className="d-flex align-items-center py-2 text-dark text-decoration-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="me-2" /> Admin Area
                </Link>
              )}
            </div>
            <div className="position-relative d-flex align-items-center justify-center">
              {!searchOpen ? (
                <button
                  className="border-0 bg-transparent text-dark p-0"
                  onClick={() => setSearchOpen(true)}
                >
                  <FiSearch size={16} />
                </button>
              ) : (
                <div
                  className="d-flex align-items-center px-2 py-1 bg-light rounded-pill shadow-sm"
                  style={{ minWidth: "250px" }}
                >
                  <FiSearch className="me-2 text-muted" size={16} />
                  <input
                    type="text"
                    className="form-control border-0 shadow-none bg-transparent px-1 py-0"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    autoFocus
                    style={{
                      fontSize: "0.9rem",
                    }}
                  />
                  <button
                    className="btn btn-sm border-0 bg-transparent text-muted"
                    onClick={() => setSearchOpen(false)}
                  >
                    <FiX size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center - Home */}
          <div className="d-flex align-items-center justify-content-around text-center gap-4">
            {/* Shop Dropdown */}
            <div
              className="me-4"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button className="btn p-0 border-0 bg-transparent d-flex align-items-center fw-light">
                <span className="extensions-dropdown">
                  SHOP HAIR EXTENSIONS{" "}
                </span>
                <span className="ms-1 fs-6">
                  <FiChevronDown />
                </span>
              </button>

              {showShopDropdown && (
                <div
                  className="position-absolute start-0 end-0 bg-white shadow-sm mt-1 py-4 z-3 animated-dropdown"
                  style={{
                    top: "100%",
                    width: "100%",
                    animation: "dropdownFadeSlide 0.2s ease-out",
                  }}
                >
                  <div className="container-fluid px-4">
                    <div className="row g-4">
                      {dropdownContent.map((section, index) => (
                        <div key={index} className="col">
                          <h3 className="fs-6 fw-bold text-uppercase mb-3 pb-2 border-bottom">
                            {section.title}
                          </h3>
                          <div className="d-flex flex-column gap-2">
                            {section.items.map((item) => (
                              <Link
                                key={item}
                                to={`/search?query=${item}`}
                                className="text-decoration-none fs-12 hover-text-dark"
                                onClick={() => setShowShopDropdown(false)}
                              >
                                {item}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="ms-4 me-4">
              <Link
                to="/"
                className="text-dark text-decoration-none extensions-dropdown"
                style={{ letterSpacing: "5px", fontSize: "25px" }}
              >
                KarinaBeautyHub
              </Link>
            </div>

            <div
              className="ms-4"
              onMouseEnter={handleInfoDropdownEnter}
              onMouseLeave={handleInfoDropdownLeave}
            >
              <button className="btn p-0 border-0 bg-transparent d-flex align-items-center fw-light">
                <span className="extensions-dropdown">INFO</span>
                <span className="ms-1 fs-6">
                  <FiChevronDown />
                </span>
              </button>

              {showInfoDropdown && (
                <div
                  className="position-absolute start-0 end-0 bg-white shadow-sm mt-1 py-3 z-3 animated-dropdown"
                  style={{
                    top: "100%",
                    width: "100%",
                    animation: "dropdownFadeSlide 0.2s ease-out",
                  }}
                >
                  <div className="d-flex flex-column gap-2 px-3">
                    {infoLinks.map(({ label, to }) => (
                      <Link
                        key={label}
                        to={to}
                        className="text-decoration-none text-dark fs-6 hover-text-dark"
                        onClick={() => setShowInfoDropdown(false)}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-4 flex-shrink-0">
            {user == null ? (
              <Link to={"/sign-in"} className="text-dark">
                <FiUser size={20} />
              </Link>
            ) : (
              <Link to={"/my-orders"} className="text-dark">
                <FiUser size={20} />
              </Link>
            )}
            <button
              onClick={() => dispatch(openCartDrawer())}
              className="text-dark position-relative border-0 bg-transparent"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} />
              {cart.totalQuantity > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {hasMounted && (
        <CartDrawer
          show={showCartDrawer}
          onClose={() => dispatch(closeCartDrawer())}
        />
      )}

      {/* Mobile Navbar */}
      <nav className="bg-white py-3 d-lg-none">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn p-0 border-0 bg-transparent"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>

            <div className="position-absolute start-50 translate-middle-x">
              <Link
                to="/"
                className="text-dark text-decoration-none fs-5 extensions-dropdown"
              >
                KarinaBeautyHub
              </Link>
            </div>

            <div className="d-flex align-items-center justify-items-center">
              <button
                className="btn p-0 border-0 bg-transparent px-4"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <FiSearch size={20} />
              </button>
              <button
                onClick={() => dispatch(openCartDrawer())}
                className="text-dark position-relative border-0 bg-transparent"
                aria-label="Cart"
              >
                <FiShoppingCart size={20} />
                {cart.totalQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart.totalQuantity}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="mt-3">
              <div className="d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm">
                <FiSearch className="me-2 text-muted" size={16} />
                <input
                  type="text"
                  className="form-control border-0 shadow-none bg-transparent px-1 py-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  autoFocus
                  style={{ fontSize: "0.9rem" }}
                />
                <button
                  className="btn btn-sm border-0 bg-transparent text-muted"
                  onClick={() => setSearchOpen(false)}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay d-lg-none mobile-nav">
          <div className="mobile-menu-container bg-white vh-100 position-fixed start-0 top-0 w-75 shadow-lg overflow-auto">
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Menu</h3>
                <button
                  className="btn p-0 border-0 bg-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="mb-2">
                {user?.role === "admin" && (
                  <Link
                    to="/admin/analytics"
                    className="d-flex align-items-center py-2 text-dark text-decoration-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="me-2" /> Admin Area
                  </Link>
                )}
              </div>

              <div className="mb-4">
                {user == null ? (
                  <Link
                    to="/sign-in"
                    className="d-flex align-items-center py-2 text-dark text-decoration-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="me-2" /> Sign In
                  </Link>
                ) : (
                  <Link
                    to="/my-orders"
                    className="d-flex align-items-center py-2 text-dark text-decoration-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="me-2" /> My Account
                  </Link>
                )}
              </div>

              <h6 className="pb-3 pt-2 border-0 bg-transparent align-items-center fw-bold extensions-dropdown">
                SHOP HAIR EXTENSIONS
              </h6>
              {dropdownContent.map((section, index) => (
                <div key={index} className="mb-3">
                  <button
                    className="d-flex justify-content-between align-items-center w-100 p-0 bg-transparent border-0"
                    onClick={() => toggleSection(section.title)}
                  >
                    <h4 className="fw-semibold text-uppercase fs-6 text-secondary mb-0">
                      {section.title}
                    </h4>
                    {expandedSections[section.title] ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>

                  {expandedSections[section.title] && (
                    <ul className="list-unstyled mt-2 ps-3">
                      {section.items.map((item) => (
                        <li key={item} className="mb-2 extensions-dropdown">
                          <Link
                            to={`/search?query=${item}`}
                            className="text-dark text-decoration-none"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className="mb-3">
                <button
                  className="d-flex justify-content-between align-items-center w-100 p-0 bg-transparent border-0"
                  onClick={() => toggleSection("INFO")}
                >
                  <h4 className="fw-semibold text-uppercase fs-6 text-secondary mb-0">
                    Info
                  </h4>
                  {expandedSections["INFO"] ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>

                {expandedSections["INFO"] && (
                  <ul className="list-unstyled mt-2 ps-3">
                    {infoLinks.map(({ label, to }) => (
                      <li key={label} className="mb-2">
                        <Link
                          to={to}
                          className="text-dark text-decoration-none"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div
            className="mobile-menu-backdrop position-fixed start-0 top-0 w-100 h-100 bg-dark opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
