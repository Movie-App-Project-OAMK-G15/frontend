import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import {format} from "date-fns"
const backendLink = import.meta.env.VITE_API_URL

export default function BrowsingReviews(){
    const [reviews, setReviews] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        async function getData() {
            try {
                const headers = {
                    headers: {
                        "Content-Type": "application/json",
                    }
                };
                const response = await axios.get(backendLink + '/reviews/getallreviews', headers)
                if(response){
                    setReviews(response.data)
                    console.log(response.data)
                }
            } catch (error) {
                alert(error)
            }
        }
        getData()
    }, [])

    return (
        <>
        <Navbar/>
        {reviews.map((review, index) => (
        <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
            {/* Review Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">{review.user_email}</h5>
                <span className="badge bg-primary fs-6">{review.rating} / 5</span>
            </div>
            {/* Review Content */}
            <p className="card-text text-muted">{review.review_content}</p>
            {/* Timestamp */}
            <div className="text-end">
                <small className="text-muted">
                Reviewed on: {format(new Date(new Date(review.created_at).setHours(new Date(review.created_at).getHours() + 2)), 'dd.MM.yyyy HH:mm')}
                </small>
            </div>
            <div className="text-center">
            <button
            className="btn btn-outline-primary"
            onClick={() => navigate(`/movie/${review.movie_id}`)}
            >
            View Details About the Movie
            </button>
        </div>            
        </div>
        </div>
        ))}

        </>
    )
}
