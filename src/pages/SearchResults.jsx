import React from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get('query');

  return (
    <div className="container py-4">
      <h2 className="mb-3">Search Results for: <strong>{searchTerm}</strong></h2>
      {/* Replace this with actual product filtering logic */}
      <p>Display products that match <code>{searchTerm}</code> here.</p>
    </div>
  );
};

export default SearchResults;
