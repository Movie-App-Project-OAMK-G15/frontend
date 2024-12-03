import { useState } from 'react';
import React from 'react';
import { useUser } from '../context/useUser';

const ReviewList = ({ reviews, onEdit, onDelete, onUpdate }) => {
const { user } = useUser(); // Access the signed-in user's information
const [editingReviewId, setEditingReviewId] = useState(null); // Track which review is being edited
const [editedContent, setEditedContent] = useState(''); // Edited review content
const [editedRating, setEditedRating] = useState(0); // Edited review rating

const startEditing = (review) => {
  setEditingReviewId(review.id);
  setEditedContent(review.review_content);
  setEditedRating(review.rating);
};

const cancelEditing = () => {
  setEditingReviewId(null);
  setEditedContent('');
  setEditedRating(0);
};

const handleUpdate = () => {
  onUpdate(editingReviewId, editedContent, editedRating); // Call the update handler
  cancelEditing(); // Exit editing mode
};

  return (
    <div className="mb-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="card mb-3">
            <div className="card-body">
            {editingReviewId === review.id ? (
                <>
                  {/* Editing Mode */}
                  <h5>Edit Your Review</h5>
                  <textarea
                    className="form-control mb-2"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  ></textarea>
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editedRating}
                    onChange={(e) => setEditedRating(e.target.value)}
                    min="1"
                    max="5"
                  />
                  <button className="btn btn-success me-2" onClick={handleUpdate}>
                    Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={cancelEditing}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {/* View Mode */}
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
                      onClick={() => startEditing(review)}
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
                </>
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