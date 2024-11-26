import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useUser } from '../context/useUser';

const MoviePage = () => {
  const { user } = useUser(); // Get the current user's information (authentication context)
  const { movieId } = useParams(); // Get the movieId from the route parameters
  const [movie, setMovie] = useState(null); // State to store movie details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State to store error messages
  const [reviews, setReviews] = useState([]); // State to store reviews

   // TMDB API key from environment variables
  const tmdbkey = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch movie details from TMDB

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits,recommendations`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tmdbkey}`, // API key for authorization
          },
        });
        const data = await response.json();
        setMovie(data); // Store the fetched movie data in state
      } catch (err) {
        setError('Error fetching movie details'); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false after the operation completes
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Fetch reviews for the movie
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/reviews/${movieId}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data); // Set the fetched reviews
        } else {
          console.error('Failed to fetch reviews'); // Log errors if fetching fails
        }
      } catch (err) {
        console.error('Fetch Reviews Error:', err.message); // Log  exceptions
      }
    };

    fetchReviews();
  }, [movieId]);

  // Function to handle new review submission
  const handleReviewSubmit = (newReview) => {
    // Add the new review to the front of the list (assuming new reviews are added first)
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // Handle Delete Review
  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:3001/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email }), // Pass user's email for verification
      });

      if (!response.ok) {
        throw new Error('Failed to delete'); // Handle unsuccessful deletions
      }
      // Update the local reviews state after deletion
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      console.log('Delete successful');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Handle Edit Review (Placeholder)
  const handleEdit = (reviewId) => {
    console.log(`Editing review with ID: ${reviewId}`);
    // Implement edit logic as needed
  };

  // Display a loading message while fetching data

  if (loading) return <p>Loading...</p>;

  // Display an error message if fetching data fails
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {/* Left Column: Poster and Title */}
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

          {/* Right Column: Movie Details */}
          <div className="col-md-8">
            {/* About Section */}
            <div className="card mb-4">
              <div className="card-body">
                <h4>About the Movie</h4>
                <p>{movie?.overview || 'No description available.'}</p>
              </div>
            </div>

            {/* Rating Section */}
            <div className="card mb-4">
              <div className="card-body">
                <h4>Rating</h4>
                <p>{movie?.vote_average ? `${movie.vote_average} / 10` : 'No rating available'}</p>
              </div>
            </div>

            {/* Trailer Section */}
            {movie?.videos?.results?.length > 0 && (
              <div className="card mb-4">
                <div className="card-body">
                  <h4>Trailer</h4>
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

        {/* Reviews Section - Check if the user is logged in*/}
        {user.token ? (
          <ReviewForm movieId={movieId} onReviewSubmit={handleReviewSubmit} />
        ) : (
          <p>You have to log in to leave a review!</p>
        )}

        {/*review List Section */}
        <div className="row mt-5">
          <h4>User Reviews</h4>
          <ReviewList movieId={movieId} reviews={reviews} onEdit={ handleEdit} onDelete={handleDelete} />
        </div>

        {/* Recommended Movies Section */}
        <div className="row mt-5">
          <h4>Recommended Movies</h4>
          {movie?.recommendations?.results?.slice(0, 5).map((rec) => (
            <div key={rec.id} className="col-md-2 col-sm-4 col-6 mb-4 text-center">
              <Link to={`/movie/${rec.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                  alt={rec.title}
                  className="rounded mb-2"
                  style={{ width: '100%' }}
                />
                <p className="small">{rec.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;