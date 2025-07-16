import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBestSellers } from "../redux/productSlice";
import Header from "./Header";
import CollectionCard from "./CollectionCard";
import productsData from "./DummyData";

export default function BestSellers() {
    const dispatch = useDispatch()

// useEffect(() => {
//   dispatch(fetchBestSellers());
// }, []);

// const { bestSellers, bestSellersLoading, bestSellersError } = useSelector(
//   (state) => state.products
// );



  return (
    <section className="best-seller py-5">
			<Header
				head1="BEST"
				head2="SELLERS"
				paragraph="Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio"
			/>
            {/* <main className="row gx-4">
        {bestSellersLoading && <p>Loading...</p>}
        {bestSellersError && <p>Error: {bestSellersError}</p>}
        {bestSellers.length > 0 &&
          bestSellers.map((product) => (
            <CollectionCard key={product._id} data={product} />
          ))}
      </main> */}
                <main className="row g-4">
				{productsData.slice(0,10).map((product) => (
                    <CollectionCard key={product._id} data={product} />
				))}
                </main>
		</section>
  )
}
