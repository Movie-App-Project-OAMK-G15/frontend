import React from 'react';

const MoviesDisplay = ({ movies, loading, error }) => {
  return (
    <div className="container">
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      {movies && movies.length > 0 ? (
        <div className="container">
          <h2 className="text-center mb-3">Movie Results</h2>
          <div className="row">
            {movies.map((movie) => (
              <div className="col-md-3 mb-3" key={movie.id}>
                <div className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    className="card-img-top"
                    alt={movie.title}
                  />
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
        !loading && <p className="text-center">No movies found. Try a different search.</p>
      )}
    </div>
  );
};

export default MoviesDisplay;
