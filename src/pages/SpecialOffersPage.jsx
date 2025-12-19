import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import CollectionCard from '../components/CollectionCard';
import { FiFilter } from 'react-icons/fi';
import { ChevronDown, Check } from 'lucide-react';
import Header from '../components/Header';

const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "discount", label: "Highest Discount" },
    { value: "priceLow", label: "Price: Low to High" },
    { value: "priceHigh", label: "Price: High to Low" },
    { value: "nameAZ", label: "Name: A to Z" },
    { value: "nameZA", label: "Name: Z to A" },
    { value: "newest", label: "Newest First" },
  ];

  const selectedSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

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
    setSortBy(option.value);
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

const SpecialOffersPage = () => {
  const { productsData } = useSelector((state) => state.products);
  const [discountedProducts, setDiscountedProducts] = useState([]);

  const [sortBy, setSortBy] = useState('discount');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [discountRange, setDiscountRange] = useState({ min: '', max: '' });

  useEffect(() => {
    if (productsData?.products) {
      const productsWithDiscounts = productsData.products.filter((product) =>
        product.variants?.some(
          (variant) =>
            variant?.promo?.isActive && variant?.promo?.discountPercent > 0
        )
      );
      setDiscountedProducts(productsWithDiscounts);
    }
  }, [productsData]);

  const categories = [...new Set(discountedProducts.map((product) => product.category))];

  const getFilteredAndSortedProducts = () => {
    let filtered = [...discountedProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter((product) => {
        const minPrice = Math.min(
          ...product.variants.map((v) =>
            v.promo?.isActive ? v.promo.promoPrice : v.price
          )
        );
        const maxPrice = Math.max(
          ...product.variants.map((v) =>
            v.promo?.isActive ? v.promo.promoPrice : v.price
          )
        );

        if (priceRange.min && minPrice < parseFloat(priceRange.min)) return false;
        if (priceRange.max && maxPrice > parseFloat(priceRange.max)) return false;
        return true;
      });
    }

    if (discountRange.min || discountRange.max) {
      filtered = filtered.filter((product) => {
        const maxDiscount = Math.max(
          ...product.variants
            .filter(v => v.promo?.isActive)
            .map(v => v.promo.discountPercent)
        );

        if (discountRange.min && maxDiscount < parseFloat(discountRange.min)) return false;
        if (discountRange.max && maxDiscount > parseFloat(discountRange.max)) return false;
        return true;
      });
    }

    switch (sortBy) {
      case 'discount':
        return filtered.sort((a, b) => {
          const aMaxDiscount = Math.max(
            ...a.variants
              .filter(v => v.promo?.isActive)
              .map(v => v.promo.discountPercent)
          );
          const bMaxDiscount = Math.max(
            ...b.variants
              .filter(v => v.promo?.isActive)
              .map(v => v.promo.discountPercent)
          );
          return bMaxDiscount - aMaxDiscount;
        });
      case 'priceLow':
        return filtered.sort((a, b) => {
          const aMin = Math.min(...a.variants.map(v => v.promo?.isActive ? v.promo.promoPrice : v.price));
          const bMin = Math.min(...b.variants.map(v => v.promo?.isActive ? v.promo.promoPrice : v.price));
          return aMin - bMin;
        });
      case 'priceHigh':
        return filtered.sort((a, b) => {
          const aMax = Math.max(...a.variants.map(v => v.promo?.isActive ? v.promo.promoPrice : v.price));
          const bMax = Math.max(...b.variants.map(v => v.promo?.isActive ? v.promo.promoPrice : v.price));
          return bMax - aMax;
        });
      case 'nameAZ':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'nameZA':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return filtered;
    }
  };

  const filteredProducts = getFilteredAndSortedProducts();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setDiscountRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min || priceRange.max || discountRange.min || discountRange.max;

  if (discountedProducts.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info" role="alert">
          <h4>No Special Offers Available</h4>
          <p className="mb-0">Check back soon for amazing deals on our premium hair extensions!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container-fluid py-4">
        <Header
            head1="SPECIAL"
            head2="OFFERS"
            paragraph="Limited time deals on premium hair extensions."
        />

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-sm btn-outline-secondary d-lg-none d-flex align-items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="me-1" />
            Filters
          </button>
        </div>

        <div className="gap-3">
          {hasActiveFilters && (
            <span className="badge bg-warning text-dark fs-6 px-3 py-2">
              {filteredProducts.length} of {discountedProducts.length} shown
            </span>
          )}
        </div>

        <div className="py-4 d-flex align-items-center">
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "2px solid #f3f4f6"
          }}>
            <h5 style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827"
            }}>Filters</h5>
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "500",
                color: hasActiveFilters ? "#ef4444" : "#9ca3af",
                backgroundColor: "transparent",
                border: `1px solid ${hasActiveFilters ? "#ef4444" : "#e5e7eb"}`,
                borderRadius: "6px",
                cursor: hasActiveFilters ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                opacity: hasActiveFilters ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                if (hasActiveFilters) {
                  e.currentTarget.style.backgroundColor = "#fef2f2";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Clear All
            </button>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <h6 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Categories</h6>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: selectedCategories.includes(category) ? "#fff" : "#374151",
                      backgroundColor: selectedCategories.includes(category) ? "#111827" : "#fff",
                      border: `1px solid ${selectedCategories.includes(category) ? "#111827" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none"
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedCategories.includes(category)) {
                        e.currentTarget.style.borderColor = "#111827";
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedCategories.includes(category)) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.backgroundColor = "#fff";
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <h6 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Price Range</h6>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  placeholder="Min £"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  style={{
                    padding: "10px 12px",
                    fontSize: "14px",
                    color: "#374151",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    width: "100%"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <input
                  type="number"
                  placeholder="Max £"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  style={{
                    padding: "10px 12px",
                    fontSize: "14px",
                    color: "#374151",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    width: "100%"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <h6 style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>Discount Range</h6>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  placeholder="Min %"
                  value={discountRange.min}
                  onChange={(e) =>
                    setDiscountRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  style={{
                    padding: "10px 12px",
                    fontSize: "14px",
                    color: "#374151",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    width: "100%"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <input
                  type="number"
                  placeholder="Max %"
                  value={discountRange.max}
                  onChange={(e) =>
                    setDiscountRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  style={{
                    padding: "10px 12px",
                    fontSize: "14px",
                    color: "#374151",
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    width: "100%"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <main className='row gx-3'>
        {currentItems.map((product) => (
            <CollectionCard key={product._id} data={product} compact={false} />
        ))}
      </main>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-5">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(1)}>First</button>
            </li>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </li>
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(totalPages)}>Last</button>
            </li>
          </ul>
        </nav>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <h4 className="text-muted">No products match your filters</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
          <button className="btn btn-outline-dark" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default SpecialOffersPage;