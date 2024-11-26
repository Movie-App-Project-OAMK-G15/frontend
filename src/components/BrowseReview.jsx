import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import ReviewList from "./ReviewList";

const BrowseReviewPage = () => {
  //get the movie ID from the URL parameters
  const { movieId } = useParams();
  //store the fetched reviews
  const [reviews, setReviews] = useState([]);
  //indicate loading status
  const [loading, setLoading] = useState(true);
  //store any error message
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/reviews/${movieId}`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          setError("Failed to fetch reviews");
        }
      } catch (err) {
        setError("Fetch Reviews Error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>Reviews for Movie ID: {movieId}</h1>
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default BrowseReviewPage;
