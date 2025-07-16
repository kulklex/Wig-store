import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import CollectionCard from "./CollectionCard";
import { fetchNewArrivals } from "../redux/productSlice";
import productsData from "./DummyData";

export default function NewArrivals() {
  const dispatch = useDispatch();
//   const { newArrivals, newArrivalsLoading, newArrivalsError } = useSelector(
//     (state) => state.products
//   );


//   useEffect(() => {
//     dispatch(fetchNewArrivals());
//   }, [dispatch]);

  return (
    <section className="latest-collections mt-4 container-fluid">
      {/* Header with title and description */}
      <Header
        head1="NEW"
        head2="ARRIVALS"
        paragraph="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the."
      />
      {/* <main className="row gx-4">
        {newArrivalsLoading && <p>Loading...</p>}
        {newArrivalsError && <p>Error: {newArrivalsError}</p>}
        {newArrivals.length > 0 &&
          newArrivals.map((product) => (
            <CollectionCard key={product._id} data={product} />
          ))}
      </main> */}
      <main className="row gx-4">
				{
					// Sort data by id and display the first 10 items
					productsData.sort((a,b) => {
						a = a.date;
						b = b.date;
						return b - a
					}).slice(0,6).map((product) => (
							<CollectionCard key={product._id} data={product} />
						))
				}
			</main>
    </section>
  );
}
