import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const GenreMoviesPage = () => {
  //extract the genreId parameter from the URL
  const { genreId } = useParams();
  //to store the list of movies
  const [movies, setMovies] = useState([]);
  //to store the name of the genre
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
      .catch((error) => console.error(error));

    //fetch the genre name
    axios
      .get("https://api.themoviedb.org/3/genre/movie/list?language=en", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbKey}`,
        },
      })
      .then((response) => {
        const genre = response.data.genres.find(
          (g) => g.id === parseInt(genreId)
        );
        if (genre) setGenreName(genre.name);
      })
      .catch((error) => console.error(error));
  }, [genreId, tmdbKey]);

  return (
    <div className="container my-4">
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
