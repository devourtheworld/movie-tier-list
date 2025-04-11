import React from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  return (
    <input
      className="search-box"
      type="text"
      placeholder="Search..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBox;