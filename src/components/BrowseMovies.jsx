import React, { useState, useEffect } from 'react'; // Import the useState and useEffect hooks
import axios from 'axios';  // Import the axios library
import 'bootstrap/dist/css/bootstrap.min.css'; // Import the Bootstrap CSS
import Navbar from './Navbar.jsx';  // Import the Navbar component
import SearchForm from './SearchForm.jsx';  // Import the SearchForm component
import MoviesDisplay from './MoviesDisplay.jsx';  // Import the MoviesDisplay component
import '../styles/BrowseMovies.css';  // Import the BrowseMovies CSS

// Define BrowseMovies component and State Initialization
const BrowseMovies = () => {
  const [query, setQuery] = useState('');   // Set query state to empty string
  const [movies, setMovies] = useState([]); // Set movies state to empty array
  const [searchType, setSearchType] = useState('title'); // Set searchType state to 'title' by default
  const [error, setError] = useState(''); // Set error state to empty string
  const [loading, setLoading] = useState(false); // Set loading state to false  
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


// Return the JSX for the BrowseMovies component
  return ( 
    <div className="browse-movies-page">
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
        <div className="row">
        <MoviesDisplay movies={movies} loading={loading} error={error} />
        </div>
      </div>

      {/* Back-to-Top Button */}
      <button 
        id="backToTopBtn" 
        title="Go to top" 
        >
        ↑ Top
      </button>
    </div>
  );
};

export default BrowseMovies;
