import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const MoviePage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]); // State to store reviews

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
          console.error('Failed to fetch reviews');
        }
      } catch (err) {
        console.error('Fetch Reviews Error:', err.message);
      }
    };

    fetchReviews();
  }, [movieId]);

  // Function to handle new review submission
  const handleReviewSubmit = (newReview) => {
    // Add the new review to the front of the list (assuming new reviews are added first)
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  if (loading) return <p>Loading...</p>;
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

        {/* Review Form and List */}
        <ReviewForm movieId={movieId} onReviewSubmit={handleReviewSubmit} />
        <ReviewList movieId={movieId} reviews={reviews} /> {/* Pass reviews as a prop */}

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
