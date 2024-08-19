import React from "react";
import {useSelector}  from "react-redux";
import MovieList from "./MovieList";

const GbtMovieSuggestions = () => {
  const { movieNames, movieContent } = useSelector((store) => store.gpt);
  if(!movieNames) return ;
  return (
    <div className="bg-black opacity-85">
      <div>
        {movieNames.map((movieName, index) => (
          <MovieList
            key={movieName}
            title={movieName}
            movies={movieContent[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default GbtMovieSuggestions;