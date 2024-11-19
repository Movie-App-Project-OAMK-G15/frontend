import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from '../context/UserContext';

const FavMovies = () => {
  //get user from UserContext
  const { user } = useContext(UserContext);
  //store favorite movies
  const [movies, setMovies] = useState([]);
  //retrieve user ID from user context
  const userId = user.user_id;

  useEffect(() => {
    //fetch favorite movies for the user
    axios
      //API call to get favorite movies
      .get(`http://localhost:3001/favorites/${userId}`)
      //set the movies state with the response data
      .then((response) => setMovies(response.data))
      .catch((error) => console.error(error));
  }, [userId]); //re-run the effect when userId changes

  return (
    <div>
      <div className="container my-4">
        <h2 className="mb-4">My Favorite Movies</h2>
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.movie_id} className="col-md-3 mb-4">
              <div className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // Movie poster image
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">Rating: {movie.vote_average}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavMovies;