import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import CollectionCard from "./CollectionCard";
import Header from "./Header";

const BestSellers = () => {
  const navigate = useNavigate();
  const {
    bestSellers,
    bestSellersLoading,
    bestSellersError,
  } = useSelector((state) => state.products);

  if (bestSellersLoading && bestSellers.length === 0) {
    return (
      <section className="latest-collections mt-5 container-fluid">
        <Header
          head1="BEST"
          head2="SELLERS"
          paragraph="Shop the most loved and top-rated products in our store"
        />
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (bestSellersError && bestSellers.length === 0) {
    return null;
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <section className="latest-collections mt-5 container-fluid">
      <Header
        head1="BEST"
        head2="SELLERS"
        paragraph="Shop the most loved and top-rated products in our store"
      />

      <main className="row gx-3">
        {bestSellers.map((product) => (
          <CollectionCard key={product._id} data={product} compact={false} />
        ))}
      </main>

      <div className="text-center mb-5 mt-3 d-flex justify-content-center">
        <Button
          variant="outline-dark"
          size="lg"
          className="px-4 py-2 fw-medium d-flex align-items-center justify-content-center mb-5"
          onClick={() => navigate('/best-sellers')}
        >
          Discover
          <FiArrowRight className="ms-2" />
        </Button>
      </div>
    </section>
  );
};

export default BestSellers;
