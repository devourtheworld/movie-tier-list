import React, { useState } from "react";
import { Movie } from "../App"; // Correctly import the Movie type

interface PopupProps {
  item: Movie;
  onClose: () => void;
  onSave: (updatedItem: Movie) => void;
}

const Popup: React.FC<PopupProps> = ({ item, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<Movie>({ ...item });
  const [newEpisodeRating, setNewEpisodeRating] = useState<number>(0);

  const handleAddEpisode = () => {
    const updatedEpisodes = [
      ...(editedItem.episodes || []),
      { episode: (editedItem.episodes?.length || 0) + 1, rating: newEpisodeRating },
    ];

    // Calculate the new total rating
    const totalPoints = updatedEpisodes.reduce((sum, ep) => sum + ep.rating, 0);
    const totalRating = parseFloat((totalPoints / updatedEpisodes.length).toFixed(2)); // Round to 2 decimal places

    setEditedItem({ ...editedItem, episodes: updatedEpisodes, totalRating });
    setNewEpisodeRating(0); // Reset the input field
  };

  const handleEpisodeRatingChange = (index: number, rating: number) => {
    const updatedEpisodes = [...(editedItem.episodes || [])];
    updatedEpisodes[index] = { ...updatedEpisodes[index], rating };

    // Calculate the new total rating
    const totalPoints = updatedEpisodes.reduce((sum, ep) => sum + ep.rating, 0);
    const totalRating = parseFloat((totalPoints / updatedEpisodes.length).toFixed(2)); // Round to 2 decimal places

    setEditedItem({ ...editedItem, episodes: updatedEpisodes, totalRating });
  };

  const handleSave = () => {
    onSave(editedItem);
    setIsEditing(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {isEditing ? (
          <>
            <h2>
              <input
                type="text"
                value={editedItem.title}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, title: e.target.value })
                }
              />
            </h2>
            <p>
              Type:{" "}
              <select
                value={editedItem.type}
                onChange={(e) =>
                  setEditedItem({
                    ...editedItem,
                    type: e.target.value as "movie" | "tv show",
                  })
                }
              >
                <option value="movie">Movie</option>
                <option value="tv show">TV Show</option>
              </select>
            </p>
            {editedItem.type === "tv show" && (
              <>
                <p>
                  Season:{" "}
                  <input
                    type="number"
                    value={editedItem.season || 1}
                    onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        season: Number(e.target.value),
                      })
                    }
                  />
                </p>
                <ul>
                  {editedItem.episodes?.map((ep, index) => (
                    <li key={index}>
                      Episode {ep.episode}:{" "}
                      <input
                        type="number"
                        value={ep.rating}
                        onChange={(e) => handleEpisodeRatingChange(index, Number(e.target.value))}
                      />{" "}
                      points
                    </li>
                  ))}
                </ul>
                <div>
                  <input
                    type="number"
                    placeholder="New Episode Rating"
                    value={newEpisodeRating}
                    onChange={(e) => setNewEpisodeRating(Number(e.target.value))}
                  />
                  <button onClick={handleAddEpisode}>Add Episode</button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2>{item.title}</h2>
            <p>Type: {item.type}</p>
            {item.type === "tv show" && <p>Season: {item.season}</p>}
            {item.type === "tv show" && (
              <ul>
                {item.episodes?.map((ep) => (
                  <li key={ep.episode}>
                    Episode {ep.episode}: {ep.rating} points
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <p>Total Rating: {item.totalRating}</p>
        <p>Last Edited: {item.lastEdited}</p>
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Popup;