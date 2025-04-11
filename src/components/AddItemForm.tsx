import React, { useState } from "react";
import { Movie } from "../App";

interface AddItemFormProps {
  onAdd: (newItem: Movie) => void;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"movie" | "tv show">("movie");
  const [season, setSeason] = useState<number | undefined>(undefined);
  const [episodes, setEpisodes] = useState<{ episode: number; rating: number }[]>([]);
  const [newEpisodeNumber, setNewEpisodeNumber] = useState<number>(1);
  const [newEpisodeRating, setNewEpisodeRating] = useState<number>(0);
  const [moviePoints, setMoviePoints] = useState<number>(0); // New state for movie points

  const handleAddEpisode = () => {
    const existingEpisode = episodes.find((ep) => ep.episode === newEpisodeNumber);
    if (existingEpisode) {
      alert("Episode already exists. Please choose a different episode number.");
      return;
    }

    setEpisodes([
      ...episodes,
      { episode: newEpisodeNumber, rating: newEpisodeRating },
    ]);
    setNewEpisodeNumber(newEpisodeNumber + 1);
    setNewEpisodeRating(0);
  };

  const handleSubmit = () => {
    const newItem: Movie = {
      id: Date.now(), // Use timestamp as a unique ID
      title,
      type,
      season: type === "tv show" ? season : undefined,
      episodes: type === "tv show" ? episodes : undefined,
      totalRating:
        type === "tv show"
          ? episodes.reduce((sum, ep) => sum + ep.rating, 0) / episodes.length || 0
          : moviePoints, // Use moviePoints for movies
      lastEdited: new Date().toISOString(),
    };
    onAdd(newItem); // Pass the new item to the parent
  };

  return (
    <div className="add-item-form">
      <h2>Add New Item</h2>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value as "movie" | "tv show")}>
          <option value="movie">Movie</option>
          <option value="tv show">TV Show</option>
        </select>
      </label>
      {type === "movie" && (
        <label>
          Points:
          <input
            type="number"
            value={moviePoints}
            onChange={(e) => setMoviePoints(Number(e.target.value))}
          />
        </label>
      )}
      {type === "tv show" && (
        <>
          <label>
            Season:
            <input
              type="number"
              value={season || ""}
              onChange={(e) => setSeason(Number(e.target.value))}
            />
          </label>
          <label>
            Episode Number:
            <input
              type="number"
              value={newEpisodeNumber}
              onChange={(e) => setNewEpisodeNumber(Number(e.target.value))}
            />
          </label>
          <label>
            Episode Rating:
            <input
              type="number"
              value={newEpisodeRating}
              onChange={(e) => setNewEpisodeRating(Number(e.target.value))}
            />
            <button onClick={handleAddEpisode}>Add Episode</button>
          </label>
          <ul>
            {episodes.map((ep) => (
              <li key={ep.episode}>
                Episode {ep.episode}: {ep.rating} points
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default AddItemForm;