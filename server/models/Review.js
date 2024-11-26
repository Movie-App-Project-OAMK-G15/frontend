import pool from "../helpers/db.js";

// Fetch all reviews for a movie
export const getReviewsByMovieId = async (movieId) => {
  const result = await pool.query('SELECT review_id AS id, user_email, review_content, rating, created_at FROM review WHERE movie_id = $1 ORDER BY created_at DESC', [movieId]);
  return result.rows;
};

// Add a new review
export const addReview = async (userEmail, reviewContent, movieId, rating) => {
  if (!userEmail) {
    throw new Error("User email is required.");
  }
  const result = await pool.query(
    `INSERT INTO review (user_email, review_content, movie_id, rating, created_at) VALUES ($1, $2, $3, $4,  NOW()) 
    RETURNING review_id AS id, user_email, review_content, movie_id, rating, created_at`,
    [userEmail, reviewContent, movieId, rating]
  );
  return result.rows[0];
};

// Delete a review by ID
export const deleteReview = async (reviewId, userEmail) => {
  // Ensure only the review's owner can delete the review
  const result = await pool.query(
    'DELETE FROM review WHERE review_id = $1 AND user_email = $2 RETURNING *',
    [reviewId, userEmail]
  );

  if (result.rowCount === 0) {
    throw new Error("Review not found or you're not authorized to delete it.");
  }
  
  return result.rows[0];
};