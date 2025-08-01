import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../redux/productSlice';
import CollectionCard from '../components/CollectionCard';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('query');

  const dispatch = useDispatch();
  const { searchResults, searchLoading, searchError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchProducts(searchTerm));
    }
  }, [searchTerm, dispatch]);

  return (
    <div className="container py-4">
      {/* <h2 className="mb-3">
        Search Results for: <strong>{searchTerm}</strong>
      </h2> */}

      {searchLoading && <p>Loading...</p>}
      {searchError && <p className="text-danger">Error: {searchError}</p>}

      <div className="row gx-4">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <CollectionCard key={product._id} data={product} />
          ))
        ) : (
          !searchLoading && <p>No products found for "<strong>{searchTerm}</strong>".</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
