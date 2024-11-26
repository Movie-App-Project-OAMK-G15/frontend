import express from 'express';
import { fetchReviews, createReview, removeReview } from '../controllers/reviewController.js';
//import { auth } from '../helpers/auth.js';

const reviewRouter = express.Router();


//reviewRouter.post('/:movieId', auth, createReview);
reviewRouter.post('/:movieId', createReview);
reviewRouter.get('/:movieId', fetchReviews);
reviewRouter.delete('/:reviewId', removeReview);

export default reviewRouter; // Default export