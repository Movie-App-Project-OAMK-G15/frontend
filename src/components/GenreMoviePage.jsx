import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../context/UserContext";
import Navbar from "./Navbar.jsx";
const backendLink = import.meta.env.VITE_API_URL
import '../styles/movieZigaZiga.css'


const GenreMoviesPage = () => {
  //get user context
  const { user } = useContext(UserContext);
  //get genreId from URL parameters
  const { genreId } = useParams();
  //navigate function for navigation
  const navigate = useNavigate();
  //state to store movies
  const [movies, setMovies] = useState([]);
  //state to store genre name
  const [genreName, setGenreName] = useState("");
  //to manage loading state
  const [loading, setLoading] = useState(true);
  //to manage error state
  const [error, setError] = useState("");
  //TMDB API key from environment variables
  const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

  //useEffect hook to fetch movies when the component mounts or genreId changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&include_adult=false&language=en-US&sort_by=popularity.desc`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${tmdbKey}`,
            },
          }
        );
        //set movies state with fetched data
        setMovies(response.data.results);
        //setloading state to false
        setLoading(false);
      } catch (err) {
        setError("Error fetching movies");
        setLoading(false);
      }
    };
    //call fetchMovies function
    fetchMovies();
  }, [genreId, tmdbKey]); //dependencies array for useEffect

  //function to add a movie to the user's favorites
  const addFavorite = async (movieId, event) => {
    event.stopPropagation(); // Prevent triggering the movie click event
    try {
      const userId = user.id; //retrieve user id from user context
      const response = await axios.post(
        backendLink + "/user/addfavorite",
        {
          movie_id: movieId,
          user_id: userId,
        }
      );
      alert("Added to Favorites"); //show alert when clicking add to fav btn
      console.log(response.data); //log response data
    } catch (error) {
      console.error("Error adding favorite movie:", error); //log error if request fails
    }
  };

  //function to handle movie card click and navigate to movie details page
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`); //navigate to the movie details page
  };

  if (loading) return <p>Loading...</p>; //display loading message
  if (error) return <p className="text-danger">{error}</p>; //display error message

  return (
    <div>
      <Navbar />
      <div className="container my-4 text-white">
        <h2 className="mb-4 fs-5">{genreName} Movies</h2> {/*display genre name */}
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4 zoom-on-hover">
              <div className="card bg-black text-white" onClick={() => handleMovieClick(movie.id)}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} //movie poster image
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  {/*conditionally render the Add to Favorites button */}
                  {user.id ? (
                    <button
                      onClick={(event) => addFavorite(movie.id, event)}
                      className="btn btn-primary"
                    >
                      Add to Favorites
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenreMoviesPage;
