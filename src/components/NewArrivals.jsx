import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import CollectionCard from "./CollectionCard";
import { fetchNewArrivals } from "../redux/productSlice";

export default function NewArrivals() {
  const dispatch = useDispatch();

  const { newArrivals, newArrivalsLoading, newArrivalsError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  return (
    <section className="latest-collections mt-4 container-fluid">
      <Header
        head1="NEW"
        head2="ARRIVALS"
        paragraph="Discover the latest additions to our luxury hair collection."
      />

      <main className="row gx-3">
        {newArrivalsLoading && <p>Loading...</p>}
        {newArrivalsError && <p>Error: {newArrivalsError}</p>}
        {newArrivals.length > 0 &&
          newArrivals.map((product) => (
            <CollectionCard key={product._id} data={product} compact={true} />
          ))}
      </main>
    </section>
  );
}
