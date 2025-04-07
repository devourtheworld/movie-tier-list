import React from "react";

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by title..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

export default SearchBox;