import React from "react";

interface MarketSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
const MarketSearch: React.FC<MarketSearchProps> = ({ searchTerm }) => (
  <div>
    MarketSearch (stub)
    <div>searchTerm: {searchTerm}</div>
  </div>
);
export default MarketSearch;
