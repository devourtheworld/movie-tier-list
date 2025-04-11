import React from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../App";

interface TitleListProps {
  items: Movie[];
}

const TitleList: React.FC<TitleListProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <ul className="title-list">
      {items.map((item) => (
        <li
          key={item.id}
          style={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
          onClick={() => navigate(`/tv-show/${item.id}`)} // Navigate on single click
        >
          <span>
            {item.title} {item.type === "tv show" && item.season ? `S:${item.season}` : ""}
          </span>
          <span>{item.totalRating.toFixed(1)}</span>
        </li>
      ))}
    </ul>
  );
};

export default TitleList;