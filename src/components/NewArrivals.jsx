import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiArrowRight } from "react-icons/fi";
import Header from "./Header";
import CollectionCard from "./CollectionCard";
import { fetchNewArrivals } from "../redux/productSlice";

export default function NewArrivals() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { newArrivals, newArrivalsLoading, newArrivalsError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  return (
    <section className="latest-collections my-5 container-fluid">
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
            <CollectionCard key={product._id} data={product} compact={false} />
          ))}
      </main>

      <div className="text-center mb-5 mt-3 d-flex justify-content-center">
        <Button
          variant="outline-dark"
          size="lg"
          className="px-4 py-2 fw-medium d-flex align-items-center justify-content-center mb-5"
          onClick={() => navigate('/new-arrivals')}
        >
          Discover
          <FiArrowRight className="ms-2" />
        </Button>
      </div>
    </section>
  );
}
