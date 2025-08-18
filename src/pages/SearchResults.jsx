import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts, fetchCategories } from '../redux/productSlice';
import CollectionCard from '../components/CollectionCard';
import { FiFilter, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('query') || '';
  const category = query.get('category') || '';
  const minPrice = query.get('minPrice') || '';
  const maxPrice = query.get('maxPrice') || '';
  const sort = query.get('sort') || '';
  const currentPage = parseInt(query.get('page')) || 1;

  const dispatch = useDispatch();
  const { searchResults, searchLoading, searchError, categories, categoriesLoading, searchPagination } = useSelector(
    (state) => state.products
  );

  const [filterForm, setFilterForm] = useState({
    category: category,
    minPrice: minPrice,
    maxPrice: maxPrice,
    sort: sort,
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      search: searchTerm,
      category,
      minPrice,
      maxPrice,
      sort,
      page: currentPage,
      limit: 12,
    };
    
    if (searchTerm || category || minPrice || maxPrice || sort) {
      dispatch(searchProducts(params));
    }
  }, [searchTerm, category, minPrice, maxPrice, sort, currentPage, dispatch]);

  const handleFilterChange = (field, value) => {
    setFilterForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterSubmit = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('query', searchTerm);
    }
    
    Object.entries(filterForm).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });

    params.append('page', '1');

    window.location.href = `/search?${params.toString()}`;
  };

  const handleClearFilters = () => {
    setFilterForm({ category: "", minPrice: "", maxPrice: "", sort: "" });
    
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append('query', searchTerm);
    }
    params.append('page', '1');
    
    window.location.href = `/search?${params.toString()}`;
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.append('query', searchTerm);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sort) params.append('sort', sort);
    params.append('page', newPage.toString());
    
    window.location.href = `/search?${params.toString()}`;
  };

  const renderPagination = () => {
    if (searchPagination.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(searchPagination.pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="mt-4">
        <div className="text-center my-3">
          <span className="text-muted small">
            Page {currentPage} of {searchPagination.pages}
            {searchPagination.total > 0 && (
              <span className="ms-2">
                • {searchPagination.total} {searchPagination.total === 1 ? 'product' : 'products'}
              </span>
            )}
          </span>
        </div>

        <nav aria-label="Product pagination">
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </button>
            </li>

            {pages.map(page => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === searchPagination.pages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === searchPagination.pages}
              >
                <FiChevronRight />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <div className="d-lg-none mb-3">
          <button
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>
              Filter & Sort Products
            </span>
            {showFilters ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>

        <div className={`bg-light rounded shadow-sm ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
          <div className="p-3">
            <div className="d-none d-lg-flex align-items-center mb-3">
              <FiFilter className="me-2" />
              <h6 className="mb-0">Filter & Sort Products</h6>
            </div>
            
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label small">Category</label>
                <select
                  className="form-select form-select-sm"
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
              
              <div className="col-6 col-md-3 col-lg-2">
                <label className="form-label small">Min Price (£)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={filterForm.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>
              
              <div className="col-6 col-md-3 col-lg-2">
                <label className="form-label small">Max Price (£)</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={filterForm.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  min="0"
                  placeholder="Any"
                />
              </div>
              
              <div className="col-12 col-md-6 col-lg-3">
                <label className="form-label small">Sort By</label>
                <select
                  className="form-select form-select-sm"
                  value={filterForm.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="">Newest First</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              
              <div className="col-12 col-md-6 col-lg-2 d-flex align-items-end gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm flex-fill"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
                <button
                  className="btn btn-dark btn-sm flex-fill"
                  onClick={handleFilterSubmit}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchLoading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {searchError && (
        <div className="alert alert-danger" role="alert">
          Error: {searchError}
        </div>
      )}
      
      {!searchLoading && !searchError && (
        <>
          {searchResults.length > 0 ? (
            <>
              <div className="row gx-4 my-4">
                {searchResults.map((product) => (
                  <CollectionCard key={product._id} data={product} />
                ))}
              </div>
              
              {renderPagination()}
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No products found for "<strong>{searchTerm}</strong>".</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
