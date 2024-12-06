import { getReviewsByMovieId, getAllReviews, addReview, deleteReview, getReviewByIdAndUserEmail, updateReview, getReviewsByUserEmail } from '../models/Review.js';


// Fetch reviews function
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

// Create review function
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

//Delete the review from the database
export const removeReview = async (req, res) => {
  const { reviewId } = req.params; // Review ID from the URL
  const { userEmail } = req.body; // User email from the request body
 

  try {
    const deletedReview = await deleteReview(reviewId, userEmail);
    res.status(200).json({ message: "Review deleted successfully", review: deletedReview });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update review function
export const updateReviewHandler = async (req, res) => {
  //console.log('Request body:', req.body); // Debugging

  const { reviewId } = req.params; // Extract reviewId from request params
  const { reviewContent, rating, userEmail } = req.body; // Extract data from request body

  try {
    // Verify that the user owns the review
    const existingReview = await getReviewByIdAndUserEmail(reviewId, userEmail);

    if (!existingReview) {
      return res.status(403).json({ error: 'Unauthorized to update this review' });
    }

    // Update the review in the database
    const updatedReview = await updateReview(reviewId, reviewContent, rating);

    res.status(200).json(updatedReview); // Respond with the updated review
  } catch (err) {
    console.error('Error updating review:', err.message);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export async function getReviewsAll(req, res){
  try {
      const response = await getAllReviews()
      return res.status(200).json(response.rows);
  } catch (error) {
      console.error("Error in getReviewsAll: ", error);
      return res.status(500).json({ error: 'Failed to load reviews' });
  }
}

export const getReviewByUser = async (req, res, next) => { 
  const { userEmail } = req.params; // Get user email from request parameters

    try {
        const reviews = await getReviewsByUserEmail(userEmail); // Call the model function
        if (!reviews.length) {
            return res.status(404).json({ error: 'No reviews found for this user' });
        }
        return res.status(200).json(reviews); // Return the reviews
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(500).json({ error: 'Failed to fetch reviews' }); // Handle errors
    }
};
