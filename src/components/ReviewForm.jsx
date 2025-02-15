import React, { useState } from 'react'; // Import the useState hook
import { useUser } from '../context/useUser'; // Import the useUser hook
const backendLink = import.meta.env.VITE_API_URL

// Define the ReviewForm component
const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const [reviewForm, setReviewForm] = useState({ content: '', userEmail: '', rating: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {user} = useUser()

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!reviewForm.content.trim() || !reviewForm.rating) {
        setError('Please provide valid content and rating.');
        return;
      }
      if (reviewForm.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewForm.userEmail)) {
        setError('Please provide a valid email address.');
        return;
      }

      // Send a POST request to the server
      const response = await fetch(backendLink + `/reviews/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          reviewContent: reviewForm.content,
          movieId,
          rating: reviewForm.rating,
        }),
      });

      // Handle the server response
      if (response.ok) {
        const newReview = await response.json();
        onReviewSubmit(newReview); // Pass new review to parent
        setReviewForm({ content: '', userEmail: '', rating: 1 });
        setSuccess('Review submitted successfully!');
        setTimeout(() => setSuccess(''), 3000); // Clear success message
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting your review.');
    }
  };

  // Render the ReviewForm component
  return (
    <div className="mb-4">
      <h4>Add a Review</h4>
      {success && <p className="text-success">{success}</p>}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control review-textarea"
            placeholder="Write your review here..."
            value={reviewForm.content}
            onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <h5>Select Rating:</h5>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi ${reviewForm.rating >= star ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
                style={{ fontSize: '1.5rem', cursor: 'pointer', marginRight: '0.5rem' }}
                onMouseEnter={() => setReviewForm({ ...reviewForm, rating: star })}
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
              ></i>
            ))}
          </div>
        </div>
        {/* <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Your email (optional)"
            value={reviewForm.userEmail}
            onChange={(e) => setReviewForm({ ...reviewForm, userEmail: e.target.value })}
          />
        </div> */}
        <button className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
