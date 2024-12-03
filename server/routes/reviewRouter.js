import express from 'express';
import { fetchReviews, createReview, getReviewsAll, removeReview, updateReviewHandler } from '../controllers/ReviewController.js';
//import { auth } from '../helpers/auth.js';

const reviewRouter = express.Router();


//reviewRouter.post('/:movieId', auth, createReview);
reviewRouter.get('/getallreviews', getReviewsAll)
reviewRouter.post('/:movieId', createReview);
reviewRouter.get('/:movieId', fetchReviews);
reviewRouter.delete('/:reviewId', removeReview);
reviewRouter.put('/:reviewId', updateReviewHandler);

export default reviewRouter; // Default export