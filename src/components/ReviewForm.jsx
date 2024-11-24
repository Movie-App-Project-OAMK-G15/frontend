import React, { useState } from 'react';

const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const [reviewForm, setReviewForm] = useState({ content: '', userEmail: '', rating: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      const response = await fetch(`http://localhost:3001/reviews/${movieId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: reviewForm.userEmail,
          reviewContent: reviewForm.content,
          movieId,
          rating: reviewForm.rating,
        }),
      });

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

  return (
    <div className="mb-4">
      <h4>Add a Review</h4>
      {success && <p className="text-success">{success}</p>}
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
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
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Your email (optional)"
            value={reviewForm.userEmail}
            onChange={(e) => setReviewForm({ ...reviewForm, userEmail: e.target.value })}
          />
        </div>
        <button className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
