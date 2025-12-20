import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, setCurrentPage } from "../redux/wishlistSlice";
import { FiHeart, FiFilter } from "react-icons/fi";
import { ChevronDown, Check } from "lucide-react";
import CollectionCard from "../components/CollectionCard";

const SortDropdown = ({ sortValue, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "addedAt", label: "Recently Added" },
    { value: "nameAsc", label: "Name A-Z" },
    { value: "nameDesc", label: "Name Z-A" },
    { value: "priceAsc", label: "Price Low to High" },
    { value: "priceDesc", label: "Price High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const selectedSort = sortOptions.find(opt => opt.value === sortValue) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    onSortChange(option.value);
    setIsOpen(false);
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: isOpen ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }
          }}
        >
          <span style={{ color: "#6b7280", fontSize: "13px" }}>Sort by:</span>
          <span style={{ color: "#111827" }}>{selectedSort.label}</span>
          <ChevronDown
            size={16}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              color: "#9ca3af",
            }}
          />
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: "220px",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
              overflow: "hidden",
              animation: "slideDown 0.2s ease",
            }}
          >
            {sortOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: selectedSort.value === option.value ? "#f9fafb" : "#fff",
                  border: "none",
                  borderBottom: index < sortOptions.length - 1 ? "1px solid #f3f4f6" : "none",
                  fontSize: "14px",
                  fontWeight: selectedSort.value === option.value ? "600" : "500",
                  color: selectedSort.value === option.value ? "#111827" : "#374151",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 
                    selectedSort.value === option.value ? "#f9fafb" : "#fff";
                }}
              >
                <span>{option.label}</span>
                {selectedSort.value === option.value && (
                  <Check size={16} style={{ color: "#3b82f6", strokeWidth: 2.5 }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const ItemsPerPageDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 12, label: "12 items" },
    { value: 24, label: "24 items" },
    { value: 48, label: "48 items" },
  ];

  const selected = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: isOpen ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.08)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
            }
          }}
        >
          <span style={{ color: "#111827" }}>{selected.label}</span>
          <ChevronDown
            size={16}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              color: "#9ca3af",
            }}
          />
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: "140px",
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              zIndex: 1000,
              overflow: "hidden",
              animation: "slideDown 0.2s ease",
            }}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: selected.value === option.value ? "#f9fafb" : "#fff",
                  border: "none",
                  borderBottom: index < options.length - 1 ? "1px solid #f3f4f6" : "none",
                  fontSize: "14px",
                  fontWeight: selected.value === option.value ? "600" : "500",
                  color: selected.value === option.value ? "#111827" : "#374151",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 
                    selected.value === option.value ? "#f9fafb" : "#fff";
                }}
              >
                <span>{option.label}</span>
                {selected.value === option.value && (
                  <Check size={16} style={{ color: "#3b82f6", strokeWidth: 2.5 }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading, currentPage, totalPages, totalItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.user);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sort: "addedAt",
    limit: 12
  });

  useEffect(() => {
    if (user) {
      dispatch(getWishlist({ ...filters, page: currentPage }));
    }
  }, [dispatch, user, filters, currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
        <Button
          variant="outline-dark"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => handlePageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="text-muted">...</span>}
          </>
        )}

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "dark" : "outline-dark"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted">...</span>}
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline-dark"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <FiHeart size={64} className="text-muted mb-2" />
        <h2 className="mb-2">Sign in to view your wishlist</h2>
        <p className="text-muted mb-4">Create an account or sign in to save your favorite products</p>
        <Button variant="dark" size="lg" href="/sign-in">
          Sign In
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="dark" />
        <p className="mt-3">Loading your wishlist...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-2">My Wishlist</h1>
          <p className="text-muted mb-0">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>
        
        <Button
          variant="outline-dark"
          onClick={() => setShowFilters(!showFilters)}
          className="d-flex align-items-center gap-2"
        >
          <FiFilter />
          Filters
        </Button>
      </div>

      {showFilters && (
        <div style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          animation: "slideDown 0.3s ease"
        }}>
          <div style={{
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "2px solid #f3f4f6"
          }}>
            <h5 style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827"
            }}>Filter & Sort</h5>
          </div>
          
          <Row className="g-3">
            <Col md={6}>
              <div style={{
                marginBottom: "8px"
              }}>
                <label style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>Sort by</label>
              </div>
              <SortDropdown 
                sortValue={filters.sort}
                onSortChange={(value) => handleFilterChange("sort", value)}
              />
            </Col>
            
            <Col md={6}>
              <div style={{
                marginBottom: "8px"
              }}>
                <label style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>Items per page</label>
              </div>
              <ItemsPerPageDropdown 
                value={filters.limit}
                onChange={(value) => handleFilterChange("limit", value)}
              />
            </Col>
          </Row>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center py-5">
          <FiHeart size={64} className="text-muted mb-3" />
          <h3 className="mb-3">Your wishlist is empty</h3>
          <p className="text-muted mb-4">Start adding products you love to your wishlist</p>
          <Button variant="dark" size="lg" href="/">
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <main className="row gx-3">
            {wishlist.map((item) => (
                  <CollectionCard key={item._id} data={item.product} compact={false} />
            ))}
          </main>

          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default Wishlist;