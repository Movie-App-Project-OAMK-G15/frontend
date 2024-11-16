import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const MoviesDisplay = ({ movies, loading, error }) => {
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container">
      {movies.length > 0 ? (
        <div className="container">
          <h2 className="text-center mb-3">Movie Results</h2>
          <div className="row">
            {movies.map((movie) => (
              <div className="col-md-3 mb-3" key={movie.id}>
                <div className="card">
                  {/* Ensure that Link receives the correct movie.id */}
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      className="card-img-top"
                      alt={movie.title}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text">{movie.overview}</p>
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
