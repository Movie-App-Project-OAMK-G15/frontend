
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar.jsx';
import SearchForm from './SearchForm.jsx';
import MoviesDisplay from './MoviesDisplay.jsx';

const BrowseMovies = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchType, setSearchType] = useState('title');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMovies([]);

    try {
      const results = await fetchMovies();
      setMovies(results);
    } catch (err) {
      setError('Error fetching movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const placeholder =
    searchType === 'title'
      ? 'Enter movie title'
      : searchType === 'genre'
      ? 'Enter genre (e.g., action, comedy)'
      : 'Enter release year (e.g., 2021)';
  const inputType = searchType === 'year' ? 'number' : 'text';

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
    </div>
  );
};

export default BrowseMovies;
