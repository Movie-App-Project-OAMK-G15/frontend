import express from 'express';
import { fetchReviews, createReview } from '../controllers/reviewController.js';
import { auth } from '../helpers/auth.js';

const reviewRouter = express.Router();


reviewRouter.post('/:movieId', auth, createReview);
//reviewRouter.post('/:movieId', createReview);
reviewRouter.get('/:movieId', fetchReviews);

export default reviewRouter; // Default export