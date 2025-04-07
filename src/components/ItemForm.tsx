import React, { useState } from "react";

interface Episode {
  episode: number;
  rating: number;
}

interface ItemFormProps {
  onSave: (item: {
    id?: number;
    title: string;
    type: "movie" | "tv show";
    season?: number;
    episodes?: Episode[];
    totalRating: number;
    lastEdited: string;
  }) => void;
  existingItem?: {
    id: number;
    title: string;
    type: "movie" | "tv show";
    season?: number;
    episodes?: Episode[];
    totalRating: number;
    lastEdited: string;
  };
}

const ItemForm: React.FC<ItemFormProps> = ({ onSave, existingItem }) => {
  const [title, setTitle] = useState(existingItem?.title || "");
  const [type, setType] = useState<"movie" | "tv show">(existingItem?.type || "movie");
  const [season, setSeason] = useState(existingItem?.season || 1);
  const [episodes, setEpisodes] = useState<Episode[]>(existingItem?.episodes || []);
  const [newEpisodeRating, setNewEpisodeRating] = useState<number>(0);

  const handleAddEpisode = () => {
    setEpisodes([...episodes, { episode: episodes.length + 1, rating: newEpisodeRating }]);
    setNewEpisodeRating(0);
  };

  const handleSave = () => {
    const totalRating =
      type === "tv show"
        ? episodes.reduce((sum, ep) => sum + ep.rating, 0) / episodes.length
        : newEpisodeRating;

    onSave({
      id: existingItem?.id,
      title,
      type,
      season: type === "tv show" ? season : undefined,
      episodes: type === "tv show" ? episodes : undefined,
      totalRating,
      lastEdited: new Date().toISOString(),
    });
  };

  return (
    <div>
      <h2>{existingItem ? "Edit Item" : "Add New Item"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value as "movie" | "tv show")}>
        <option value="movie">Movie</option>
        <option value="tv show">TV Show</option>
      </select>
      {type === "tv show" && (
        <>
          <input
            type="number"
            placeholder="Season"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          />
          <div>
            <input
              type="number"
              placeholder="Episode Rating"
              value={newEpisodeRating}
              onChange={(e) => setNewEpisodeRating(Number(e.target.value))}
            />
            <button onClick={handleAddEpisode}>Add Episode</button>
          </div>
          <ul>
            {episodes.map((ep) => (
              <li key={ep.episode}>
                Episode {ep.episode}: {ep.rating} points
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={handleSave}>{existingItem ? "Update Item" : "Add Item"}</button>
    </div>
  );
};

export default ItemForm;