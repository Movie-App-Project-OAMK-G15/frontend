import pool from "../helpers/db.js";

// Fetch all reviews for a movie
export const getReviewsByMovieId = async (movieId) => {
  const result = await pool.query('SELECT * FROM review WHERE movie_id = $1 ORDER BY created_at ', [movieId]);
  return result.rows;
};

// Add a new review
export const addReview = async (userEmail, reviewContent, movieId, rating, createdAt) => {
  const result = await pool.query(
    'INSERT INTO review (user_email, review_content, movie_id, rating, created_at) VALUES ($1, $2, $3, $4,  NOW()) RETURNING *',
    [userEmail, reviewContent, movieId, rating]
  );
  return result.rows[0];
};