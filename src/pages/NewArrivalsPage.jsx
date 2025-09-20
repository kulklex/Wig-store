import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../redux/productSlice';
import CollectionCard from '../components/CollectionCard';
import { FiFilter } from 'react-icons/fi';
import Header from '../components/Header';

const NewArrivalsPage = () => {
  const dispatch = useDispatch();
  const { newArrivals, newArrivalsLoading, newArrivalsError } = useSelector(
    (state) => state.products
  );

  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const categories = [...new Set(newArrivals.map((product) => product.category))];

  const getFilteredAndSortedProducts = () => {
    let filtered = [...newArrivals];

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

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min || priceRange.max;

  if (newArrivalsLoading && newArrivals.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border spinner-border-lg text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading new arrivals...</p>
      </div>
    );
  }

  if (newArrivalsError && newArrivals.length === 0) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4>Error Loading New Arrivals</h4>
          <p className="mb-0">{newArrivalsError}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container-fluid py-4">
        <Header
            head1="NEW"
            head2="ARRIVALS"
            paragraph="Discover the latest additions to our luxury hair collection."
            filter={filteredProducts.length}
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
              {filteredProducts.length} of {newArrivals.length} shown
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            style={{ minWidth: '150px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="nameAZ">Name: A to Z</option>
            <option value="nameZA">Name: Z to A</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="bg-light p-4 rounded-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Filters</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear All
            </button>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <h6>Categories</h6>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`btn btn-sm ${
                      selectedCategories.includes(category) ? 'btn-dark' : 'btn-outline-dark'
                    }`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <h6>Price Range</h6>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min £"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max £"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
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

export default NewArrivalsPage;
