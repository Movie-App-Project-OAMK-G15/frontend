import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div className="mb-4">
      <h4>Reviews</h4>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{review.rating} Stars</h5>
              <p className="card-text">{review.review_content}</p>
              <p className="text-muted">
                Reviewed by: {review.user_email || 'Anonymous'} on{' '}
                {new Date(review.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to write one!</p>
      )}
    </div>
  );
};

export default ReviewList;
