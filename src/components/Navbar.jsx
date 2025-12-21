import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { closeCartDrawer, getTotals, openCartDrawer } from "../redux/cartSlice";
import { fetchCategories, fetchProductAttributes } from "../redux/productSlice";
import { getWishlistCount } from "../redux/wishlistSlice";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiHeart,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ PRODUCTS: true });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterForm, setFilterForm] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user);
  const showCartDrawer = useSelector((state) => state.cart.showDrawer);
  const { categories, categoriesLoading, attributes } = useSelector((state) => state.products);
  const { wishlistCount } = useSelector((state) => state.wishlist);
  const productsData = useSelector((state) => state.products.products);

  const dropdownTimeoutRef = useRef(null);
  const infoDropdownTimeoutRef = useRef(null);

  useEffect(() => {
    if (!categories) return;
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    dispatch(fetchProductAttributes());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(getWishlistCount());
    }
  }, [user, dispatch]);

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

  const handleFilterChange = (field, value) => {
    setFilterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterSubmit = () => {
    const params = new URLSearchParams();
    
    Object.entries(filterForm).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    navigate(`/search?${params.toString()}`);
    setFilterModalOpen(false);
    setFilterForm({ category: "", minPrice: "", maxPrice: "", sort: "" });
  };

  const handleClearFilters = () => {
    setFilterForm({ category: "", minPrice: "", maxPrice: "", sort: "" });
  };

  const dropdownContent = useMemo(() => {
    const sections = [
      {
        title: "PRODUCTS",
        items: attributes?.categories?.length ? attributes.categories : categories,
      },
      {
        title: "TEXTURE",
        items: attributes?.textures || [],
      },
      {
        title: "LACE SIZE",
        items: attributes?.laceSizes || [],
      },
      {
        title: "LACE TYPE",
        items: attributes?.laceTypes || [],
      },
      {
        title: "COLOR",
        items: attributes?.colors || [],
      },
    ];

    return sections
      .map((section) => ({
        ...section,
        items: (section.items || []).filter((item) => item && String(item).trim() !== ""),
      }))
      .filter((section) => section.items.length > 0);
  }, [attributes, categories]);

  const infoLinks = [
    { label: "About", to: "/about-us" },
    { label: "Contact", to: "/contact" },
    { label: "FAQs", to: "/faqs" },
    { label: "Returns", to: "/returns-and-refunds" },
    { label: "Shipping", to: "/shipping" },
  ];

  const toggleSection = (title) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <nav className="bg-white d-flex py-3 position-relative d-none d-lg-block">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between">
            {/* Left Section - Search Icon */}
            <div className="d-flex align-items-center">
              <div className="position-relative d-flex align-items-center gap-4">
                {!searchOpen ? (
                  <button
                    className="border-0 bg-transparent text-dark p-0"
                    onClick={() => setSearchOpen(true)}
                  >
                    <FiSearch size={20} />
                  </button>
                ) : (
                  <div
                    className="d-flex align-items-center px-3 py-2 bg-light rounded-pill shadow-sm"
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

                  {user?.role === "admin" && (
                <Link
                  to="/admin/analytics"
                  className="d-flex align-items-center py-2 text-dark text-decoration-none fw-medium"
                  style={{ fontSize: "0.9rem" }}
                >
                  <FiUser className="me-2" size={18} /> Admin Area
                </Link>
              )}
              </div>
            </div>

            {/* Center Section - Navigation Links and Logo */}
            <div
              className="flex-grow-1"
              style={{
                minHeight: "48px",
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                justifyItems: "center",
                columnGap: "32px"
              }}
            >
              {/* Left trigger snug to logo */}
              <div
                className="d-flex align-items-center justify-content-end"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="btn p-0 border-0 bg-transparent d-flex align-items-center fw-light text-uppercase">
                  <span className="extensions-dropdown" style={{ fontSize: "13px", letterSpacing: "0.5px", fontWeight: "400" }}>
                    Shop Hair Extensions
                  </span>
                  <span className="ms-1 fs-6">
                    <FiChevronDown />
                  </span>
                </button>

                {showShopDropdown && (
                  <div
                    className="position-absolute bg-white shadow-sm mt-1 z-3 animated-dropdown small"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "clamp(320px, 95vw, 1180px)",
                      padding: "22px 28px",
                      borderRadius: "6px",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
                      animation: "dropdownFadeSlide 0.2s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "18px 28px",
                      }}
                    >
                      {dropdownContent.map((section, index) => (
                        <div key={index}>
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
                )}
              </div>

              {/* Centered Logo */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-dark text-decoration-none text-center"
                  style={{ 
                    letterSpacing: "2px", 
                    fontSize: "22px", 
                    fontWeight: "400",
                    minWidth: "220px"
                  }}
                >
                  <div style={{ lineHeight: "1.1" }}>
                    <div className="text-uppercase">KarinaHairLuxe</div>
                    <div style={{ fontSize: "11px", letterSpacing: "1.5px", fontWeight: "300", marginTop: "2px" }}>
                      RAW HAIR EXTENSIONS
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right trigger snug to logo */}
              <div
                className="d-flex align-items-center justify-content-start position-relative"
                onMouseEnter={handleInfoDropdownEnter}
                onMouseLeave={handleInfoDropdownLeave}
              >
                <button className="btn p-0 border-0 bg-transparent d-flex align-items-center fw-light text-uppercase">
                  <span className="extensions-dropdown" style={{ fontSize: "13px", letterSpacing: "0.5px", fontWeight: "400" }}>
                    Info
                  </span>
                  <span className="ms-1 fs-6">
                    <FiChevronDown />
                  </span>
                </button>

                {showInfoDropdown && (
                  <div
                    className="position-absolute start-50 translate-middle-x bg-white shadow-sm mt-1 py-3 z-3 animated-dropdown small"
                    style={{
                      top: "100%",
                      minWidth: "200px",
                      animation: "dropdownFadeSlide 0.2s ease-out",
                    }}
                  >
                    <div className="d-flex flex-column gap-2 px-3">
                      {infoLinks.map(({ label, to }) => (
                        <Link
                          key={label}
                          to={to}
                          className="text-decoration-none text-dark fs-12 hover-text-dark"
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

            {/* Right Section - User and Cart Icons */}
            <div className="d-flex align-items-center gap-4">
              {user == null ? (
                <Link to={"/sign-in"} className="text-dark">
                  <FiUser size={20} />
                </Link>
              ) : (
                <Link to={"/my-orders"} className="text-dark">
                  <FiUser size={20} />
                </Link>
              )}

              <Link to={"/wishlist"} className="text-dark position-relative border-0 bg-transparent">
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {wishlistCount}
                  </span>
                )}
              </Link>
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
        </div>
      </nav>

      {hasMounted && (
        <CartDrawer
          show={showCartDrawer}
          onClose={() => dispatch(closeCartDrawer())}
        />
      )}

      {/* mobile view */}
      <nav className="bg-white py-3 d-lg-none">
        <div className="container-fluid px-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <button
                className="btn p-0 border-0 bg-transparent"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <button
                className="btn p-0 border-0 bg-transparent px-2"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <FiSearch size={20} />
              </button>
            </div>

            <div className="position-absolute start-50 translate-middle-x text-center">
              <Link
                to="/"
                className="text-dark text-decoration-none"
                style={{
                  letterSpacing: "1.5px",
                  fontSize: "17px",
                  fontWeight: "400",
                  lineHeight: "1.05",
                  display: "inline-block",
                  minWidth: "160px"
                }}
              >
                <div className="text-uppercase">KarinaHairLuxe</div>
                <div style={{ fontSize: "10px", letterSpacing: "1.2px", fontWeight: "300", marginTop: "1px" }}>
                  RAW HAIR EXTENSIONS
                </div>
              </Link>
            </div>

            <div className="d-flex align-items-center justify-items-center gap-3">
              {user && (
                <button onClick={() => navigate('wishlist')} className="position-relative border-0 bg-transparent">
                  <FiHeart size={20} />
                  {wishlistCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {wishlistCount}
                    </span>
                  )}
                </button>
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

              <div className="mb-4">
                <button
                  className="d-flex align-items-center py-2 text-dark text-decoration-none border-0 bg-transparent w-100"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setFilterModalOpen(true);
                  }}
                >
                  <FiFilter className="me-2" /> Filter & Sort
                </button>
              </div>

              {/* <h6 className="pb-3 pt-2 border-0 bg-transparent align-items-center fw-bold extensions-dropdown">
                SHOP HAIR EXTENSIONS
              </h6> */}
              {dropdownContent.map((section, index) => (
                <div key={index} className="mb-3">
                  <button
                    className="d-flex justify-content-between align-items-center w-100 p-0 bg-transparent border-0 small"
                    onClick={() => toggleSection(section.title)}
                  >
                    <h4 className="text-dark text-decoration-none fs-6">
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
                  <h4 className="text-dark text-decoration-none fs-6 text-uppercase">
                    Info
                  </h4>
                  {expandedSections["INFO"] ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>

                {expandedSections["INFO"] && (
                  <ul className="list-unstyled mt-2 ps-3 small">
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

      <AnimatePresence>
        {filterModalOpen && (
          <>
            <motion.div
              className="modal-backdrop fade show"
              style={{ zIndex: 1040 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterModalOpen(false)}
            />

            <motion.div
              className="modal d-block"
              tabIndex="-1"
              style={{ zIndex: 1050 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div
                  className="modal-content border-0 shadow rounded-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header bg-white text-black border-0">
                    <h5 className="modal-title">Filter & Sort Products</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setFilterModalOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body text-black">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={filterForm.category}
                          onChange={(e) => handleFilterChange("category", e.target.value)}
                          disabled={categoriesLoading}
                        >
                          <option value="">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-6">
                        <label className="form-label">Min Price (£)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={filterForm.minPrice}
                          onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                          min="0"
                          placeholder="0"
                        />
                      </div>
                      
                      <div className="col-6">
                        <label className="form-label">Max Price (£)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={filterForm.maxPrice}
                          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                          min="0"
                          placeholder="Any"
                        />
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label">Sort By</label>
                        <select
                          className="form-select"
                          value={filterForm.sort}
                          onChange={(e) => handleFilterChange("sort", e.target.value)}
                        >
                          <option value="">Newest First</option>
                          <option value="priceAsc">Price: Low to High</option>
                          <option value="priceDesc">Price: High to Low</option>
                          <option value="popular">Most Popular</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={handleFilterSubmit}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
