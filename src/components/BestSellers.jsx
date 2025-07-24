import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollectionCard from "./CollectionCard";
import Header from "./Header";
import { fetchBestSellers } from "../redux/productSlice";

const BestSellers = () => {
  const dispatch = useDispatch();
  const {
    bestSellers,
    bestSellersLoading,
    bestSellersError,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchBestSellers());
  }, [dispatch]);

  return (
    <section className="latest-collections mt-5 container-fluid">
      <Header
        head1="BEST"
        head2="SELLERS"
        paragraph="Shop the most loved and top-rated products in our store"
      />

      <main className="row gx-4">
        {bestSellersLoading && <p>Loading...</p>}
        {bestSellersError && <p>Error: {bestSellersError}</p>}
        {!bestSellersLoading &&
          !bestSellersError &&
          bestSellers?.map((product) => (
            <CollectionCard key={product._id} data={product} />
          ))}
      </main>
    </section>
  );
};

export default BestSellers;
