import express from 'express'; // Import express
import { fetchReviews, createReview, getReviewsAll, removeReview, updateReviewHandler, getReviewByUser } from '../controllers/ReviewController.js'; 
//import { auth } from '../helpers/auth.js';

const reviewRouter = express.Router(); 


//reviewRouter.post('/:movieId', auth, createReview);
reviewRouter.get('/getallreviews', getReviewsAll)
reviewRouter.post('/:movieId', createReview); // Create a new review
reviewRouter.get('/:movieId', fetchReviews); // Fetch reviews for a movie
reviewRouter.delete('/:reviewId', removeReview); // Delete a review
reviewRouter.put('/:reviewId', updateReviewHandler); // Update a review
reviewRouter.get('/user/:userEmail', getReviewByUser); 

export default reviewRouter; // Default export