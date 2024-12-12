import express from 'express'; // Import express
import { fetchReviews, createReview, getReviewsAll, removeReview, updateReviewHandler, getReviewByUser } from '../controllers/ReviewController.js'; 
//import { auth } from '../helpers/auth.js';

const reviewRouter = express.Router(); 


//reviewRouter.post('/:movieId', auth, createReview);
// Endpoint to get all reviews for display on the reviews page
reviewRouter.get('/getallreviews', getReviewsAll);
// Requires: Nothing
// Middleware: None
// Returns: A list of all reviews in the database

// Endpoint to create a new review for a specific movie
reviewRouter.post('/:movieId', createReview);
// Requires: movieId in the URL, and review content in the body (e.g., rating, text)
// Middleware: None
// Returns: Confirmation message that the review was successfully created

// Endpoint to fetch reviews for a specific movie
reviewRouter.get('/:movieId', fetchReviews);
// Requires: movieId in the URL
// Middleware: None
// Returns: A list of reviews associated with the specified movie

// Endpoint to delete a specific review
reviewRouter.delete('/:reviewId', removeReview);
// Requires: reviewId in the URL
// Middleware: None
// Returns: Confirmation message that the review was successfully deleted or an error if it could not be found

// Endpoint to update a specific review
reviewRouter.put('/:reviewId', updateReviewHandler);
// Requires: reviewId in the URL and updated review content in the body
// Middleware: None
// Returns: Confirmation message that the review was successfully updated

// Endpoint to fetch all reviews created by a specific user
reviewRouter.get('/user/:userEmail', getReviewByUser);
// Requires: userEmail in the URL
// Middleware: None
// Returns: A list of reviews authored by the specified user


export default reviewRouter; // Default export