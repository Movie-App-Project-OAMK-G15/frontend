import React from 'react'; // Import the React library
import { Link } from 'react-router-dom'; // Import Link for navigation
import "../styles/BrowseMovies.css";// Import Css Styles

// Define MoviesDisplay component
const MoviesDisplay = ({ movies, loading, error }) => {
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  // Display the movie results
  return (
    <div className="container browse-movies">
      {movies.length > 0 ? (
        <div>
          <h2 className="text-center mb-3">Movie Results</h2>
          <div className="row ">
            {movies.map((movie) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4" key={movie.id}>
                <div className="card h-100">
                  {/* Ensure that Link receives the correct movie.id */}
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      className="card-img-top"
                      alt={movie.title}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title text-truncate">{movie.title}</h5>
                    {/* Movie rating removed as requested */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No movies found. Try a different search.</p>
      )}
    </div>
  );
};

export default MoviesDisplay;
