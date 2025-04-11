import React, { useState } from "react";

interface FilterOptionsProps {
  onFilterByPoints: (minPoints: number, maxPoints: number) => void;
  onFilterByDate: (startDate: string, endDate: string) => void;
  onFilterByType: (type: string[]) => void; // New prop for filtering by type
  onSort: (criteria: string) => void; // New prop for sorting
  onResetFilters: () => void; // Add this prop
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  onFilterByPoints,
  onFilterByDate,
  onFilterByType,
  onSort,
  onResetFilters, // Destructure the new prop
}) => {
  const [minPoints, setMinPoints] = useState<number>(0);
  const [maxPoints, setMaxPoints] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // State for selected types
  const [sortCriteria, setSortCriteria] = useState<string>("date"); // State for sorting criteria

  const handlePointsFilter = () => {
    onFilterByPoints(minPoints, maxPoints);
  };

  const handleDateFilter = () => {
    onFilterByDate(startDate, endDate);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);
    onSort(criteria);
  };

  const handleApplyTypeFilter = () => {
    onFilterByType(selectedTypes);
  };

  return (
    <div className="filter-options">
      <div>
        <h3>Filter by Points</h3>
        <label>
          Min Points:
          <input
            type="number"
            value={minPoints}
            onChange={(e) => setMinPoints(Number(e.target.value))}
          />
        </label>
        <label>
          Max Points:
          <input
            type="number"
            value={maxPoints}
            onChange={(e) => setMaxPoints(Number(e.target.value))}
          />
        </label>
        <button onClick={handlePointsFilter}>Apply Points Filter</button>
      </div>
      <div>
        <h3>Filter by Date</h3>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleDateFilter}>Apply Date Filter</button>
      </div>
      <div>
        <h3>Filter by Type</h3>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("movie")}
            onChange={() => handleTypeChange("movie")}
          />
          Movies
        </label>
        <label>
          <input
            type="checkbox"
            checked={selectedTypes.includes("tv show")}
            onChange={() => handleTypeChange("tv show")}
          />
          TV Shows
        </label>
        <button onClick={handleApplyTypeFilter}>Apply Type Filter</button>
      </div>
      <div>
        <h3>Sort By</h3>
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="date">Date</option>
          <option value="points">Points</option>
        </select>
      </div>
      <button onClick={onResetFilters}>Reset Filters</button>
    </div>
  );
};

export default FilterOptions;