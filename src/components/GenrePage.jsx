import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const GenrePage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    //fetching genres from TMDB API
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tmdbKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error(error));

    //fetching movies from TMDB API
    fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbKey}`,
        },
      }
    )
      .then((response) => response.json())
      //set the fetched movies to state
      .then((data) => setMovies(data.results))
      //logging any error
      .catch((error) => console.error(error));
  }, [tmdbKey]); //use effect runs when tmdb key changes

  return (
    <div className="container">
  <h2 className="my-4">Popular Genres:</h2>
  {genres
    .filter((genre) => movies.some((movie) => movie.genre_ids.includes(genre.id))) //filter genres with no related movies
    .map((genre) => (
      <div key={genre.id} className="mb-4">
        <h3>{genre.name}</h3>
        <div className="row">
          {movies
            .filter((movie) => movie.genre_ids.includes(genre.id))
            .map((movie) => (
              //uunique keys by combining movie.id with genre.id
              <div key={`${movie.id}-${genre.id}`} className="col-md-3 mb-3">
                <div className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
    ))}
</div>
  );
};

export default GenrePage;
