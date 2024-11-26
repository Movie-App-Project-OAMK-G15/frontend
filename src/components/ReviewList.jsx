import React from 'react';
import { useUser } from '../context/useUser';

const ReviewList = ({ reviews, onEdit, onDelete }) => {
const { user } = useUser(); // Access the signed-in user's information
  return (
    <div className="mb-4">
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
              {/* Conditionally render Edit and Delete buttons */}
              {user.email === review.user_email && (
                  <div>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => onEdit(review.id)}
                    >
                      Edit Review
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onDelete(review.id)}
                    >
                      Delete Review
                    </button>
                  </div>
                )}
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
