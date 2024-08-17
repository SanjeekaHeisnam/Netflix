import React, { useRef, useState } from 'react';
import lang from '../utils/languageConstants';
import { useDispatch, useSelector } from 'react-redux'; 
import { API_OPTIONS, GEMINI_KEY } from '../utils/constants';
import axios from 'axios';
import { addGptMovieResult } from '../utils/gptSlice';

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // search movie in TMDB
  const searchMovieTMDB = async (movie) =>{
    const data = await fetch("https://api.themoviedb.org/3/search/movie?query="+movie+"&include_adult=false&language=en-US&page=1",API_OPTIONS)
    const json =  await data.json()
    
    
    return json.results;  
  }

  const handleGptSearchClick = async () => {
    const promptText = searchText.current.value;
    console.log("Prompt Text:", promptText);

    const query = `Act as a movie Recommendation system and suggest some movies for the query: ${promptText}. Only give me names of 5 movies, comma separated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya`;

    async function generateContent() {
      setLoading(true);
      setError('');

      try {
        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            contents: [
              {
                parts: [
                  {
                    text: promptText
                  }
                ]
              }
            ]
          }
        });

        console.log(response['data']['candidates'][0]['content']['parts'][0]['text']);
        const gptMovies = response['data']['candidates'][0]['content']['parts'][0]['text'].split(",");

       //For each movie I will search TMDB API
      const promiseArray = gptMovies.map((movie)=>searchMovieTMDB(movie));
      //[Promise, Promise, Promise,Promise,Promise]

      const tmdbResults = await Promise.all(promiseArray);
      console.log(tmdbResults);

      dispatch(addGptMovieResult({moviesName: gptMovies, movieResults:tmdbResults}));
        // Check if candidates array exists and has content
        if (response.data.candidates && response.data.candidates.length > 0) {
          const generatedContent = response.data.candidates[0].content.text;
          setResult(generatedContent || 'No content generated.');
        } else {
          setResult('No content generated.');
        }
      } catch (error) {
        console.error("Error generating content:", error);
        setError('Failed to generate content.');
      } finally {
        setLoading(false);
      }
    }

    generateContent(query);
  };

  return (
    <div className="pt-[10%] flex justify-center">
      <form className="w-1/2 bg-black grid grid-cols-12" onSubmit={(e) => e.preventDefault()}>
        <input 
          ref={searchText}
          type="text" 
          className="p-4 m-4 col-span-9" 
          placeholder={lang[langKey].gptSearchPlaceholder} 
        />
        <button 
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg" 
          onClick={handleGptSearchClick}
          disabled={loading}>
          {loading ? 'Generating...' : lang[langKey].search}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {result && <p className="text-white">{result}</p>}
    </div>
  );
}

export default GptSearchBar;
