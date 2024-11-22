import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MoviePage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({ content: '', rating: 1 });
  const [success, setSuccess] = useState('');

  const tmdbkey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits,recommendations`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tmdbkey}`,
          },
        });
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError('Error fetching movie details');
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/reviews/${movieId}`);
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error("Fetch Reviews Error:", err.message);
      }
    };

    fetchMovieDetails();
    fetchReviews();
  }, [movieId]);

  const handleLogin = async () => {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token); // Save token
      localStorage.setItem('userEmail', data.email); // Save user email
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
  
    if (!token || !userEmail) {
      setError('You must be logged in to add a review.');
    }
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail"); // Assuming the email is stored in localStorage

      if (!token || !userEmail) {
        setError('You must be logged in to submit a review.');
        return;
      }
      // Construct the request body with the necessary data
    const requestBody = {
      userEmail,              // Pass the user's email
      reviewContent: reviewForm.content, // Extract the review content from the form
      movieId,                  // Include the movie ID
      rating: reviewForm.rating,         // Include the star rating from the form
    };
      const response = await fetch(`http://localhost:3001/reviews/${movieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        setReviewForm({ content: '', rating: 1 });
        setSuccess('Review submitted successfully!');
        const updatedReviews = await response.json();
        setReviews(updatedReviews);
      } else {
        setError('Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {/* Left Column: Movie Poster and Title */}
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

          {/* Right Column: About, Rating, Trailer */}
          <div className="col-md-8 d-flex flex-column" style={{ height: '100%' }}>
            <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
              {/* About the Movie */}
              <div className="card mb-4 flex-fill">
                <div className="card-body">
                  <h4 className="card-title">About the Movie</h4>
                  <p className="card-text">{movie?.overview || 'No description available.'}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="card mb-4 flex-fill">
                <div className="card-body">
                  <h4 className="card-title">Rating</h4>
                  <p className="card-text">
                    {movie?.vote_average ? `${movie.vote_average} / 10` : 'No rating available'}
                  </p>
                </div>
              </div>

              {/* Trailer */}
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

        {/* Cast */}
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

        {/* Add a Review */}
        <div className="mb-4">
          <h4>Add a Review</h4>
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Write your review here..."
                value={reviewForm.content}
                onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <h5>Select Rating:</h5>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`bi ${reviewForm.rating >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                    style={{ fontSize: '1.5rem', cursor: 'pointer', marginRight: '0.5rem' }}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  ></i>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Submit Review</button>
          </form>

          {/* Display Reviews */}
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{review.rating} Stars</h5>
                  <p className="card-text">{review.content}</p>
                  <p className="text-muted">{new Date(review.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to write one!</p>
          )}
        </div>

        {/* Recommended Movies */}
        <div className="row mt-5">
          <h4>Recommended Movies</h4>
          {movie?.recommendations?.results?.slice(0, 5).map((rec) => (
            <div key={rec.id} className="col-md-2 col-sm-4 col-6 mb-4 text-center">
              <Link to={`/movie/${rec.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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