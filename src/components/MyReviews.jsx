import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser  } from '../context/useUser.jsx'; 
import Navbar from './Navbar.jsx';
import '../styles/MyReviews.css'
import 'bootstrap'
const backendLink = import.meta.env.VITE_API_URL



const MyReviews = () => {
    const { userEmail } = useParams(); // Get user email from URL parameters
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true); 
            try {
                const response = await axios.get(backendLink + `/reviews/user/${userEmail}`);
                setReviews(response.data);
                setError(null);
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Error fetching reviews');
                setReviews([]);
            } finally {
                setLoading(false); 
            }
        };

        fetchReviews();
    }, [userEmail]);

    return (
        <div>
            <Navbar />
            <div key="review" className="container mt-4">
                <h1 className='title-myreview'><strong>My Reviews</strong></h1>
                {loading && <p>Loading reviews...</p>} 
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="text-white card mb-3">
                            <div className=" text-white card-body">
                                <p className="text-white review-text"><strong>Content:</strong> {review.review_content}</p>
                                <p className='myreview-text'><strong>Rating:</strong> {review.rating} Stars</p>
                                <p className='myreview-text'><strong>Created at:</strong> {new Date(review.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-nofound'>No reviews found.</p>
                )}
            </div>
        </div>
    );
};

export default MyReviews;