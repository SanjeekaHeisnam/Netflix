import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    movieNames:  null,
    movieContent: null,
    movieSuggestion:  [], // Initialize as an empty array make change here
    toggleSuggestion: false,
  },
  reducers: {
    toggleGptSearchView: (state, action) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResult: (state, action) => {
      const { movieContent, movieNames } = action.payload;
      state.movieContent = movieContent;
      state.movieNames = movieNames;
    },
    removeAiMovies: (state, action) => {
      state.movieContent = null;
      state.movieNames = null;
    },
    showMovieSuggestion: (state, action) => {
      state.movieSuggestion = action.payload; // Ensure payload is an array
    },
    removeMovieSuggestion: (state, action) => {
      state.movieSuggestion = []; // Set to an empty array
    },
    setToggleSuggestion:(state, action) => {
      state.toggleSuggestion = !state.toggleSuggestion;
    },
  },
});

export const {
  toggleGptSearchView,
  addGptMovieResult,
  removeAiMovies,
  showMovieSuggestion,
  setToggleSuggestion,
  removeMovieSuggestion,
} = gptSlice.actions;

export default gptSlice.reducer;