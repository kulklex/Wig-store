import React from "react";
import { useSelector } from "react-redux";
import CollectionCard from "./CollectionCard";
import Header from "./Header";

const BestSellers = () => {
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
        {bestSellers.slice(0, 4).map((product) => (
          <CollectionCard key={product._id} data={product} compact={false} />
        ))}
      </main>
    </section>
  );
};

export default BestSellers;
