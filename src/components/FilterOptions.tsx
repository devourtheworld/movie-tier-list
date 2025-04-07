import React from "react";

interface FilterOptionsProps {
  onFilter: (filter: string) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ onFilter }) => {
  return (
    <select onChange={(e) => onFilter(e.target.value)}>
      <option value="">All</option>
      <option value="movie">Movies</option>
      <option value="tv show">TV Shows</option>
      <option value="high-rating">High Rating</option>
      <option value="recently-edited">Recently Edited</option>
    </select>
  );
};

export default FilterOptions;