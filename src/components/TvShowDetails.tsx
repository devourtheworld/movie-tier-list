import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Movie } from "../App";

interface TvShowDetailsProps {
  movies: Movie[];
}

const TvShowDetails: React.FC<TvShowDetailsProps> = ({ movies }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tvShow = movies.find((movie) => movie.id === Number(id));

  if (!tvShow) {
    return <div>TV Show not found</div>;
  }

  return (
    <div className="tv-show-details">
      <button onClick={() => navigate("/")}>Back</button>
      <h1>{tvShow.title}</h1>
      <p>Total Rating: {tvShow.totalRating.toFixed(2)}</p>
      {tvShow.episodes && tvShow.episodes.length > 0 ? (
        tvShow.episodes.map((ep, index) => (
          <div key={index}>
            <h3>Season {Math.ceil((index + 1) / 10)}</h3>
            <div className="episode-grid">
              {tvShow.episodes
                ?.slice(index * 10, (index + 1) * 10)
                .map((episode, epIndex) => (
                  <div
                    key={epIndex}
                    className={`episode-box ${
                      episode.rating >= 8
                        ? "high-rating"
                        : episode.rating >= 5
                        ? "medium-rating"
                        : "low-rating"
                    }`}
                  >
                    {episode.rating}
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <p>No episodes available</p>
      )}
      <button>Edit</button>
    </div>
  );
};

export default TvShowDetails;