import { getReviewsByMovieId, addReview } from '../models/Review.js';

// Example usage
export const fetchReviews = async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await getReviewsByMovieId(movieId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req, res) => {
  const { userEmail, reviewContent, movieId, rating } = req.body;

  if (!userEmail || !reviewContent || !rating || !movieId) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Add the review to the database
    
    const newReview = await addReview(userEmail, reviewContent, movieId, rating);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to add review' });
  }
};