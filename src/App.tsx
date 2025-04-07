import React, { useState, useEffect } from "react";
import SearchBox from "./components/SearchBox";
import TitleList from "./components/TitleList";
import FilterOptions from "./components/FilterOptions";
import ItemForm from "./components/ItemForm";
import Popup from "./components/Popup";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filePath, setFilePath] = useState<string | null>(
    localStorage.getItem("moviesFilePath")
  );
  const [showList, setShowList] = useState(false);
  const [editingItem, setEditingItem] = useState<Movie | null>(null);
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const savedMovies = localStorage.getItem("moviesData");
    if (savedMovies) {
      const parsedMovies = JSON.parse(savedMovies);
      setMovies(parsedMovies);
      setFilteredMovies(parsedMovies);
    } else if (filePath) {
      fetch(filePath)
        .then((response) => response.json())
        .then((data) => {
          setMovies(data);
          setFilteredMovies(data);
          localStorage.setItem("moviesData", JSON.stringify(data));
        })
        .catch((error) => console.error("Error loading JSON file:", error));
    }
  }, [filePath]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const handleFilter = (filter: string) => {
    let filtered = [...movies];
    if (filter === "movie") {
      filtered = filtered.filter((movie) => movie.type === "movie");
    } else if (filter === "tv show") {
      filtered = filtered.filter((movie) => movie.type === "tv show");
    } else if (filter === "high-rating") {
      filtered = filtered.sort((a, b) => b.totalRating - a.totalRating);
    } else if (filter === "recently-edited") {
      filtered = filtered.sort(
        (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );
    }
    setFilteredMovies(filtered);
  };

  const handleSaveItem = (item: Movie) => {
    let updatedMovies;
  
    // Calculate total rating for TV shows
    if (item.type === "tv show" && item.episodes) {
      const totalPoints = item.episodes.reduce((sum, ep) => sum + ep.rating, 0);
      const totalRating = parseFloat((totalPoints / item.episodes.length).toFixed(2)); // Round to 2 decimal places
      item.totalRating = totalRating; // Update the totalRating field
    }
  
    if (item.id) {
      // Update existing item
      updatedMovies = movies.map((m) => (m.id === item.id ? item : m));
    } else {
      // Add new item
      updatedMovies = [...movies, { ...item, id: movies.length + 1 }];
    }
  
    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    localStorage.setItem("moviesData", JSON.stringify(updatedMovies));
    setEditingItem(null);
  };

  const handleEditItem = (item: Movie) => {
    setEditingItem(item);
  };

  const handleItemDoubleClick = (item: Movie) => {
    setSelectedItem(item);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedItem(null);
  };

  const handleEditFromPopup = () => {
    if (selectedItem) {
      setEditingItem(selectedItem);
      setIsPopupVisible(false);
    }
  };

  const handleSavePopup = (updatedItem: Movie) => {
    // Calculate total rating for TV shows
    if (updatedItem.type === "tv show" && updatedItem.episodes) {
      const totalPoints = updatedItem.episodes.reduce((sum, ep) => sum + ep.rating, 0);
      const totalRating = parseFloat((totalPoints / updatedItem.episodes.length).toFixed(2)); // Round to 2 decimal places
      updatedItem.totalRating = totalRating; // Update the totalRating field
    }

    const updatedMovies = movies.map((movie) =>
      movie.id === updatedItem.id ? updatedItem : movie
    );

    setMovies(updatedMovies);
    setFilteredMovies(updatedMovies);
    localStorage.setItem("moviesData", JSON.stringify(updatedMovies));
    setIsPopupVisible(false);
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(movies, null, 2); // Convert movies state to JSON
    const blob = new Blob([dataStr], { type: "application/json" }); // Create a Blob object
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const link = document.createElement("a"); // Create a temporary anchor element
    link.href = url;
    link.download = "movies.json"; // Set the file name
    link.click(); // Trigger the download
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div>
      <h1>Movie & TV Show List</h1>
      <input type="file" accept=".json" onChange={(e) => { /* File handling logic */ }} />
      <SearchBox onSearch={handleSearch} />
      <button onClick={() => setShowList(true)}>Load Full List</button>
      <button onClick={() => setEditingItem(null)}>Add New Item</button>
      <button onClick={handleDownload}>Download Updated File</button>
      {editingItem && (
        <ItemForm
          onSave={handleSaveItem}
          existingItem={{ ...editingItem, id: editingItem.id ?? 0 }} // Ensure id is defined
        />
      )}
      {!editingItem && showList && (
        <>
          <FilterOptions onFilter={handleFilter} />
          <TitleList
            items={filteredMovies} // Pass the full Movie objects
            onItemDoubleClick={handleItemDoubleClick}
          />
        </>
      )}
      {isPopupVisible && selectedItem && (
        <Popup
          item={selectedItem}
          onClose={handleClosePopup}
          onSave={handleSavePopup}
        />
      )}
    </div>
  );
};

export default App;
