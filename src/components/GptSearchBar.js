import React, { useRef, useState  } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { API_OPTIONS, GEMINI_KEY, safetySettings } from "../utils/constants";
import {
  addGptMovieResult,
  removeAiMovies,
  removeMovieSuggestion,
  setToggleSuggestion,
  showMovieSuggestion,
} from "../utils/gptSlice";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GptSearchBar = () => {
  const searchText = useRef(null);
  const langKey = useSelector((store) => store.config.lang);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const genAI = React.useMemo(() => new GoogleGenerativeAI(GEMINI_KEY), []);
  const movieSuggestion = useSelector((store) => store.gpt.movieSuggestion);
  const showSuggestion = useSelector((store) => store.gpt.toggleSuggestion);

  const searchMovieTMDB = async (movie) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
        API_OPTIONS
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching movie data:", error);
      return [];
    }
  };

  const handleGptSearchClick  = async () => {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        body: JSON.stringify({
          safety_settings: safetySettings,
        }),
      });

      const query = `Act as a Movie Recommendation system and suggest some movies for the query: ${searchText.current.value}. Only give me names of 5 Movies, comma separated like the example result given ahead. Example Result: Golmaal, Dhol, Phir Hera Pheri, Hungama`;
      const result = await model.generateContent(query);
      setLoading(true);

      if (!result) {
        console.error("Error generating content");
        return;
      }

      const response = await result.response;
      const text = await response.text();
      const movies = text.split(",");
      const movieData = movies.map((movie) => searchMovieTMDB(movie.trim()));
      const movieResolved = await Promise.all(movieData);

      dispatch(addGptMovieResult({ movieNames: movies, movieContent: movieResolved }));
    } catch (error) {
      console.error("Error handling search result:", error);
    }  finally {
      setLoading(false);
    }
  };

  const handleClearMovie = () => {
    dispatch(removeAiMovies());
    if (searchText.current) {
      searchText.current.value = "";
    }
    dispatch(removeMovieSuggestion());
    dispatch(setToggleSuggestion());
  };

  const handleInputChange = async () => {
    if (searchText.current && searchText.current.value.length > 0) {
      const input = searchText.current.value;
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=en-US&page=1`,
          API_OPTIONS
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        const filteredData = data.results.slice(0, 10);
        const suggest = filteredData.map((movie) => movie.title);
        dispatch(showMovieSuggestion(suggest));
        dispatch(setToggleSuggestion());
      } catch (error) {
        console.error("Error fetching movie suggestions:", error);
      }
    } else {
      dispatch(setToggleSuggestion());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (searchText.current) {
      searchText.current.value = suggestion;
    }
    dispatch(removeMovieSuggestion());
    dispatch(setToggleSuggestion());
  };

  return (
    <div className="pt-[10rem] justify-center md:pt-[8rem] lg:pt-[8rem] 2xl:pt-[7.5rem] flex">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-black opacity-75 my-3 mx-2 grid grid-cols-12 w-[30rem] rounded-md md:w-[40rem] lg:w-[50rem] 2xl:w-[55rem]"
      >
        <input
          type="text"
          ref={searchText}
          onChange={handleInputChange}
          placeholder={lang[langKey].gptSearchPlaceholder}
          className="col-span-8 mx-4 my-5 py-2 text-[0.65rem] rounded-md text-black font-medium md:col-span-8 md:m-5 md:text-[0.9rem] lg:col-span-8 lg:m-5 lg:text-[1rem] 2xl:col-span-8 2xl:m-4 2xl:text-[1.2rem]"
        />
        <button
          type="button"
          className="col-span-2 mx-3 my-5 rounded-lg text-[0.65rem] md:col-span-2 md:m-5 md:text-[0.9rem] lg:col-span-2 lg:m-5 lg:text-[1rem] 2xl:col-span-2 2xl:p-3 2xl:m-5 2xl:text-text-[1.1rem]"
          onClick={handleGptSearchClick }
          style={{ backgroundColor: "#ff0000", color: "#ffffff" }} disabled={loading}
        >
          {loading ? 'Generating...' : lang[langKey].search }
        </button>
        <button
          type="button"
          className="col-span-1 mx- my-5 text-[0.65rem] rounded-lg md:col-span-2 md:m-5 md:text-[0.9rem] lg:col-span-2 lg:m-5 lg:text-[1rem] 2xl:col-span-2 2xl:p-3 2xl:m-5 2xl:text-text-[1.1rem]"
          onClick={handleClearMovie}
          style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
        >
          {lang[langKey].clear}
        </button>
        {showSuggestion && movieSuggestion.length > 0 && (
          <div className="bg-black rounded-md text-white -mt-5 col-span-6 self-center mx-2 text-xs font-medium md:-mt-2 md:mx-5 md:text-xs lg:-mt-3 lg:mx-5 lg:text-sm 2xl:-mt-4 2xl:mx-5 2xl:text-md">
            {movieSuggestion.map((suggestion) => (
              <p
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="hover:bg-red-500 cursor-pointer"
              >
                {suggestion}
              </p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default GptSearchBar;