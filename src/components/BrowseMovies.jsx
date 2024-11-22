import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; // Import Axios
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Navbar from './Navbar.jsx'; 
import SearchForm from './SearchForm.jsx'; 
import MoviesDisplay from './MoviesDisplay.jsx'; 
import '../styles/BrowseMovies.css';

// Define BrowseMovies component

const BrowseMovies = () => { 
  const [query, setQuery] = useState(''); // State for the search query
  const [movies, setMovies] = useState([]); // State for storing fetched movies
  const [searchType, setSearchType] = useState('title'); // State for search type
  const [error, setError] = useState(''); // State for error handling
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [genreMap, setGenreMap] = useState({}); // State for storing genre map
  const tmdbkey = import.meta.env.VITE_TMDB_API_KEY; // API Key for TMDB

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

  // Centralized function to fetch movie data
  const fetchMovies = async () => {
    let url;
    switch (searchType) {
      case 'genre':
        const genreId = genreMap[query.toLowerCase()]; // Get genre ID
        if (!genreId) throw new Error('Invalid genre name'); // Check for valid genre
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`;
        break;
      case 'year':
        url = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${query}`;
        break;
      case 'title':
      default:
        url = `https://api.themoviedb.org/3/search/movie?query=${query}`;
    }

    // Fetch movie data from TMDB by using the access token
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${tmdbkey}`, // Pass the API key in the request header
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
      setMovies(results); // Set the fetched movie results
    } catch (err) {
      setError('Error fetching movies. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Placeholder text based on the search type
  const placeholder = searchType === 'title'
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
        
        <MoviesDisplay 
          movies={movies} 
          loading={loading} 
          error={error} 
        />
      </div>

      {/* Back-to-Top Button */}
      <button 
        id="backToTopBtn" 
        title="Go to top" >
        ↑ Top
      </button>
    </div>
  );
};

export default BrowseMovies;