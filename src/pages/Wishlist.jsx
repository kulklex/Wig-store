import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist, setCurrentPage } from "../redux/wishlistSlice";
import { FiHeart, FiTrash2, FiFilter, FiX } from "react-icons/fi";
import CollectionCard from "../components/CollectionCard";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading, currentPage, totalPages, totalItems } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.user);

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

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
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
        <FiHeart size={64} className="text-muted mb-3" />
        <h2 className="mb-3">Sign in to view your wishlist</h2>
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
        <div className="bg-light p-3 rounded mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Filter & Sort</h6>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => setShowFilters(false)}
            >
              <FiX />
            </Button>
          </div>
          
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-medium">Sort by</Form.Label>
                <Form.Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="addedAt">Recently Added</option>
                  <option value="nameAsc">Name A-Z</option>
                  <option value="nameDesc">Name Z-A</option>
                  <option value="priceAsc">Price Low to High</option>
                  <option value="priceDesc">Price High to Low</option>
                  <option value="rating">Highest Rated</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small fw-medium">Items per page</Form.Label>
                <Form.Select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
                >
                  <option value={12}>12 items</option>
                  <option value={24}>24 items</option>
                  <option value={48}>48 items</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center py-5">
          <FiHeart size={64} className="text-muted mb-3" />
          <h3 className="mb-3">Your wishlist is empty</h3>
          <p className="text-muted mb-4">Start adding products you love to your wishlist</p>
          <Button variant="dark" size="lg" href="/search">
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {wishlist.map((item) => (
              <Col key={item._id} lg={4} md={6}>
                <div className="position-relative">
                  <CollectionCard data={item.product} compact={false} />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => handleRemoveFromWishlist(item.product._id)}
                    style={{ zIndex: 10 }}
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </Col>
            ))}
          </Row>

          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default Wishlist;
