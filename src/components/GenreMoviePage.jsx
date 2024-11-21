import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from '../context/UserContext';
import Navbar from "./Navbar.jsx";

const GenreMoviesPage = () => {
  //retrieve user from UserContext
  const { user } = useContext(UserContext); 
  //extract the genreId parameter from the URL
  const { genreId } = useParams();
  //store the list of movies
  const [movies, setMovies] = useState([]);
  //store the name of the genre
  const [genreName, setGenreName] = useState("");
  //TMDB API key from .env
  const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    //fetch movies for the selected genre
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&include_adult=false&language=en-US&sort_by=popularity.desc`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${tmdbKey}`,
          },
        }
      )
      .then((response) => setMovies(response.data.results))
      .catch((error) => console.error('Error fetching movies:', error));
  }, [genreId, tmdbKey]);

  const addFavorite = async (movieId) => {
    try {
      const userId = user.id; //retrievee userid from user context
      const response = await axios.post('http://localhost:3001/user/addfavorite', {
        movie_id: movieId,
        user_id: userId,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error adding favorite movie:', error);
    }
  };

  return (
    <div className="container my-4">
     < Navbar/>
      <h2 className="mb-4">{genreName} Movies</h2>
      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} //movie poster image
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">Rating: {movie.vote_average}</p>
                {/*conditionally render the Add to Favorites button */}
                {user.id ? (
                  <button onClick={() => addFavorite(movie.id)} className="btn btn-primary">
                    Add to Favorites
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/*to navigate back to the genres page */}
      <Link to="/" className="btn btn-secondary mt-3">
        Back to Genres
      </Link>
    </div>
  );
};

export default GenreMoviesPage;