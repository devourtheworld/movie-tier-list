import React from "react";
import { Movie } from "../App"; // Import the Movie type

interface TitleListProps {
  items: Movie[]; // Accept an array of full Movie objects
  onItemDoubleClick: (item: Movie) => void; // Pass the full Movie object
}

const TitleList: React.FC<TitleListProps> = ({ items, onItemDoubleClick }) => {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          onDoubleClick={() => onItemDoubleClick(item)} // Pass the full Movie object
          style={{ cursor: "pointer" }}
        >
          {item.title} - {item.totalRating} points
        </li>
      ))}
    </ul>
  );
};

export default TitleList;