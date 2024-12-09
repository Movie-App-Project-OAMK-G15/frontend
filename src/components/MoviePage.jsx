import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useUser } from "../context/useUser";
import "../styles/MoviePage.css";
//import BrowseReviewPage from "./BrowseReview";
const backendLink = import.meta.env.VITE_API_URL


// MoviePage component
const MoviePage = () => {
  //get user context
  const { user } = useUser();
  //get movieId from URL parameters
  const { movieId } = useParams();
  //state to store movie details
  const [movie, setMovie] = useState(null);
  //to manage loading state
  const [loading, setLoading] = useState(true);
  //to manage error state
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]); //state to store reviews

   // TMDB API key from environment variables
  const tmdbkey = import.meta.env.VITE_TMDB_API_KEY;

  // Fetch movie details from TMDB

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=videos,credits,recommendations`;
      try {
        const response = await fetch(url, {
          method: "GET",
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
        const response = await fetch(
          backendLink + `/reviews/${movieId}`
        );
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

  //function to handle new review submission
  const handleReviewSubmit = (newReview) => {
    //add the new review to the front of the list (assuming new reviews are added first)
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // Handle Delete Review
  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(backendLink + `/reviews/${reviewId}`, {
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
  // Function to handle review updates
  const handleUpdate = async (reviewId, newContent, newRating) => {
    try {
      const response = await fetch(backendLink + `/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email, // User's email for authorization
          reviewContent: newContent, // Updated review content
          rating: newRating, // Updated review rating
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
  
      const updatedReview = await response.json();
  
      // Update the local state with the updated review
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? updatedReview : review
        )
      );
      //console.log('Review updated successfully');
    } catch (err) {
      console.error('Update failed', err);
    }
  };
  
  // Display a loading message while fetching data

  if (loading) return <p>Loading...</p>;

  // Display an error message if fetching data fails
  if (error) return <p className="text-danger">{error}</p>;

  //function to add a movie to the user's favorites
  const addFavorite = async (movieId, event) => {
    event.stopPropagation(); // Prevent triggering the movie click event
    try {
      const userId = user.id; //retrieve user id from user context
      const response = await axios.post(
        backendLink + "/user/addfavorite",
        {
          movie_id: movieId,
          user_id: userId,
        }
      );
      alert("Added to Favorites"); //show alert when clicking add to fav btn
      console.log(response.data); //log response data
    } catch (error) {
      console.error("Error adding favorite movie:", error); //log error if request fails
    }
  };

  //render the movie details
  return (
    <div className="movie-page">
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {/*left Column: Poster and Title */}
          <div className="col-lg-4 col-md-5 mb-4">
            <h1 className="mb-3">{movie?.title}</h1>

            <div className="mb-3">
                  {/*conditionally render the Add to Favorites button */}
                  {user.id ? (
                    <button
                      onClick={(event) => addFavorite(movie.id, event)}
                      className="btn btn-primary w-100 w-md-auto"
                    >
                      Add to Favorites
                    </button>
                  ) : null}
                </div>

            {movie?.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="img-fluid rounded movie-poster"
              />
            )}
          </div>

          {/*right Column: Movie Details */}
          <div className="col-lg-8 col-md-7">
            {/*about Section */}
            <div className="card mb-4">
              <div className="card-body">
                <h4>About the Movie</h4>
                <p>{movie?.overview || "No description available."}</p>
              </div>
            </div>

            {/*rating Section */}
            <div className="card mb-4">
              <div className="card-body">
                <h4>Rating</h4>
                <p>
                  {movie?.vote_average
                    ? `${movie.vote_average} / 10`
                    : "No rating available"}
                </p>
              </div>
            </div>

            {/*trailer Section */}
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
        {/* Cast */}
        <div className="mb-4">
          <h4>Cast</h4>
          <div className="cast-container">
            {movie?.credits?.cast?.slice(0, 8).map((actor) => (
              <div key={actor.id} className="cast-item">
                <img
                  src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                  alt={actor.name}
                  className="rounded-circle"
                 
                />
                <p className="mb-0">{actor.name}</p>
                <small className="text-muted">as {actor.character}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section - Check if the user is logged in*/}
        {user.token ? (
          <ReviewForm movieId={movieId} onReviewSubmit={handleReviewSubmit} />
        ) : (
          <p>You have to log in to leave a review!</p>
        )}

        {/*review List Section */}
        <div className="container mt-5">
          <div className="row">
            <h4>User Reviews</h4>
            <ReviewList movieId={movieId} reviews={reviews.slice(0, 3)} onEdit={handleEdit} onDelete={handleDelete} onUpdate={handleUpdate}/> {/* Show only the latest 2 or 3 reviews */}
            
            {/* <Link to={`/reviews/${movieId}`} className="btn btn-primary">
              Browse More Reviews
            </Link> */}
          </div>
        </div>

        {/* Recommended Movies Section */}
        <div className="row mt-5">
          <h4>Recommended Movies</h4>
          {movie?.recommendations?.results?.slice(0, 5).map((rec) => (
            <div
              key={rec.id}
              className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4 text-center"
            >
              <Link to={`/movie/${rec.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                  alt={rec.title}
                  className="rounded mb-2 recommended-poster"
                  style={{ width: "100%" }}
                />
                </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
              

export default MoviePage;