import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar.jsx';
import SearchForm from './SearchForm.jsx';
import MoviesDisplay from './MoviesDisplay.jsx';
import '../styles/BrowseMovies.css';

// Define BrowseMovies component and State Initialization
const BrowseMovies = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [genreMap,setGenreMap] = useState({}); // state for storing genre map
  const tmdbkey = import.meta.env.VITE_TMDB_API_KEY; // Access Token

  // Fetch genres and store them in state
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list?language=en', {
          headers: {
            Authorization: `Bearer ${tmdbkey}` // Use API key in headers
          }
        });
        const genres = response.data.genres; // Extract genres array from response
        const genreMap = genres.reduce((map, genre) => {
          map[genre.name.toLowerCase()] = genre.id; // Map genre name to ID
          return map;
        }, {});
        setGenreMap(genreMap); // Update state with genre map
      } catch (error) {
        setError('Failed to fetch genres. Please try again later.');
      }
    };

    fetchGenres(); // Call the fetchGenres function
  }, [tmdbkey]);

  
  // Centralized function to fetch movie data with Access Token
    const fetchMovies = async () => {
    let url;
    switch (searchType) {
      case 'genre':
        const genreId = genreMap[query.toLowerCase()];
        if (!genreId) throw new Error('Invalid genre name');
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`;
        break;
      case 'year':
        url = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${query}`;
        break;
      case 'title':
      default:
        url = `https://api.themoviedb.org/3/search/movie?query=${query}`;
    }

    // Fetch the movie data from TMDB by using access token 
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tmdbkey}`, // Pass the access token in the Authorization header
      },
    });

    return response.data.results || [];
  };


// Handle the search operation
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMovies([]);

    try {
      const results = await fetchMovies();
      setMovies(results);// Set the fetched movie results
    } catch (err) {
      setError('Error fetching movies. Please try again.'); // Set error message
    } finally {
      setLoading(false);// Stop loading
    }
  };

  // Placeholder text based on the search type
  const placeholder =
    searchType === 'title'
      ? 'Enter movie title'
      : searchType === 'genre'
      ? 'Enter genre (e.g., action, comedy)'
      : 'Enter release year (e.g., 2021)';
  const inputType = searchType === 'year' ? 'number' : 'text';

  // Back-to-Top button functionality
  useEffect(() => {
    const backToTopBtn = document.getElementById("backToTopBtn");
    
    // Show the back-to-top button when the user scrolls down
    const scrollFunction = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    };

    window.onscroll = function() {
      scrollFunction();
    };

    // Scroll to top when the button is clicked
    backToTopBtn.addEventListener("click", function() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
    });

    return () => {
      window.onscroll = null;
      backToTopBtn.removeEventListener("click", () => {});
    };
  }, []);



  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Movie Search</h1>
        <SearchForm
          handleSearch={handleSearch}
          searchType={searchType}
          setSearchType={setSearchType}
          query={query}
          setQuery={setQuery}
          placeholder={placeholder}
          inputType={inputType}
        />
        <MoviesDisplay movies={movies} loading={loading} error={error} />
      </div>

      {/* Back-to-Top Button */}
      <button 
        id="backToTopBtn" 
        title="Go to top" 
        style={{ display: 'none', position: 'fixed', bottom: '20px', right: '20px', fontSize: '24px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '50%' }}>
        ↑ Top
      </button>
    </div>
  );
};

export default BrowseMovies;
