import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBox from "./components/SearchBox";
import TitleList from "./components/TitleList";
import FilterOptions from "./components/FilterOptions";
import AddItemForm from "./components/AddItemForm";
import TvShowDetails from "./components/TvShowDetails";
import "./App.css";

interface Episode {
  episode: number;
  rating: number;
}

export interface Movie {
  id?: number; // Make id optional
  title: string;
  type: "movie" | "tv show";
  season?: number;
  episodes?: Episode[];
  totalRating: number;
  lastEdited: string;
}

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // State for selected types
  const [showList, setShowList] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedMovies = localStorage.getItem("moviesData");
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies));
      setFilteredMovies(JSON.parse(savedMovies));
    }
  }, []);

  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredMovies(movies); // Show all movies if no type is selected
    } else {
      const filtered = movies.filter((movie) => selectedTypes.includes(movie.type));
      setFilteredMovies(filtered);
    }
  }, [selectedTypes, movies]); // Re-run filtering when selectedTypes or movies change

  const handleSearch = (query: string) => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSort = (criteria: string) => {
    const sorted = [...filteredMovies].sort((a, b) => {
      if (criteria === "date") {
        return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
      } else if (criteria === "points") {
        return b.totalRating - a.totalRating;
      }
      return 0;
    });
    setFilteredMovies(sorted);
  };

  const handleLoadFullList = () => {
    setShowList(true);
    setFilteredMovies(movies);
  };

  const getLastFiveItems = () => {
    return [...movies]
      .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime())
      .slice(0, 5);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-container">
              <div>
                <SearchBox onSearch={handleSearch} />
                {/* Add Item Button */}
                <button className="add-button" onClick={() => setIsAdding(true)}>
                  Add
                </button>
              </div>

              {/* Add Item Form */}
              {isAdding && <AddItemForm onAdd={() => {}} onCancel={() => setIsAdding(false)} />}

              {/* Checkboxes for filtering by type */}
              {showList && (
                <div className="filter-checkboxes">
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
                  {/* Dropdown for sorting */}
                  <div className="sort-dropdown">
                    <label htmlFor="sort">Sort By:</label>
                    <select id="sort" onChange={(e) => handleSort(e.target.value)}>
                      <option value="date">Date</option>
                      <option value="points">Points</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Advanced Filter Button */}
              {showList && (
                <button className="advanced-filter-button" onClick={toggleFilters}>
                  {showFilters ? "Hide Filters" : "Advanced Filter"}
                </button>
              )}

              {/* Advanced Filter Section */}
              {showList && showFilters && (
                <FilterOptions
                  onFilterByPoints={() => {}}
                  onFilterByDate={() => {}}
                  onFilterByType={() => {}}
                  onSort={() => {}}
                  onResetFilters={() => {}}
                />
              )}

              {/* List of Items */}
              <TitleList items={showList ? filteredMovies : getLastFiveItems()} />

              {/* Check Full List Button */}
              {!showList && (
                <button className="full-list-button" onClick={handleLoadFullList}>
                  Check Full List
                </button>
              )}
            </div>
          }
        />
        <Route path="/tv-show/:id" element={<TvShowDetails movies={movies} />} />
      </Routes>
    </Router>
  );
};

export default App;