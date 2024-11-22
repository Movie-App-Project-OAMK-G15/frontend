import { getReviewsByMovieId, addReview } from '../models/review.js';

// Example usage
export const fetchReviews = async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await getReviewsByMovieId(movieId);
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const createReview = async (req, res) => {
  const { movieId } = req.params;
  const { userEmail, reviewContent, rating } = req.body;
  if (!userEmail || !reviewContent || !rating) {
    return res.status(400).json({ error: 'User email, content, and rating are required' });
  }

  try {
    const newReview = await addReview(userEmail, reviewContent, movieId, rating, Date.now());
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};