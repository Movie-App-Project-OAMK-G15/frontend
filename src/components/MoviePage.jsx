import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS
import Navbar from './Navbar'; // Importing the Navbar component


// Define a functional component named MoviePage and Intialize the state
const MoviePage = () => {
  const { movieId } = useParams(); // Get the movieId from the URL parameters
  const [movie, setMovie] = useState(null); // Initialize a state variable to store the movie data
  const [loading, setLoading] = useState(true); // Initialize a state variable to track the loading status
  const [error, setError] = useState(''); // Initialize a state variable to store any error messages
  const tmdbkey = import.meta.env.VITE_TMDB_API_KEY; // Get the TMDB API key from the environment variables

//  Use the useEffect hook to fetch the movie data when the component mounts
  const fetchMovieDetails = async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits,reviews,recommendations`;
//  Send a GET request to the TMDB API
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tmdbkey}`, // Include the TMDB API key in the Authorization header
        },
      });

      const data = await response.json(); // Parse the response data as JSON
      setMovie(data); // Update the movie state with the fetched data
    } catch (err) {
      setError('Error fetching movie details'); // Set the error message if the fetch fails
    } finally {
      setLoading(false);
    }
  };
// Call the fetchMovieDetails function when the component mounts
  useEffect(() => {
    fetchMovieDetails();
  }, [movieId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Navbar /> {/* Include the Navbar component at the top of the page */}
      <div className="container mt-4">
        <div className="row">
          {/* Left Column: Movie Title, Poster */}
          <div className="col-md-4 mb-4">
            <h1 className="mb-4">{movie?.title}</h1>

            {movie?.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded mb-4"
              />
            )}
          </div>

          {/* Right Column: About the Movie, Rating, and Trailer */}
          <div className="col-md-8 d-flex flex-column" style={{ height: '100%' }}>
            <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
              {/* About the Movie Card */}
              <div className="card mb-4 flex-fill">
                <div className="card-body">
                  <h4 className="card-title">About the Movie</h4>
                  <p className="card-text">{movie?.overview || 'No description available.'}</p>
                </div>
              </div>

              {/* Rating Card */}
              <div className="card mb-4 flex-fill">
                <div className="card-body">
                  <h4 className="card-title">Rating</h4>
                  <p className="card-text">
                    {movie?.vote_average ? `${movie.vote_average} / 10` : 'No rating available'}
                  </p>
                </div>
              </div>

              {/* Trailer Section */}
              {movie?.videos?.results?.length > 0 && ( 
                <div className="card mb-4">
                  <div className="card-body">
                    <h4 className="card-title">Trailer</h4>
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                      title="Movie Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
                  {/* Cast Section with Circular Images */}
        <div className="mb-4">
          <h4>Cast</h4>
          <div className="d-flex flex-wrap">
            {movie?.credits?.cast?.slice(0, 10).map((actor) => (
              <div key={actor.id} className="me-3 mb-3 text-center">
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="rounded-circle"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <p className="mb-0">{actor.name}</p>
                <small className="text-muted">as {actor.character}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section with Bootstrap Cards */}
        <div className="mb-4">  
          <h4>Reviews</h4>
          <div className="row">   
            {movie?.reviews?.results?.length > 0 ? ( 
              movie.reviews.results.slice(0, 5).map((review) => ( 
                <div key={review.id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{review.author}</h5>
                      <p className="card-text">{review.content.slice(0, 200)}...</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        </div>

        {/* Recommended Movies Section */}
        <div className="row mt-5">
          <h4>Recommended Movies</h4>
          {movie?.recommendations?.results?.slice(0, 5).map((rec) => (
            <div key={rec.id} className="col-md-2 col-sm-4 col-6 mb-4 text-center">
              <img
                src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                alt={rec.title}
                className="rounded mb-2"
                style={{ width: '100%' }}
              />
              <p className="small">{rec.title}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};


export default MoviePage;