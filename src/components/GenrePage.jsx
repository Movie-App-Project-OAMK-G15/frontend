import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/movieZigaZiga.css'


const GenrePage = () => {
  //to store genre
  const [genres, setGenres] = useState([]);
  //store movies
  const [movies, setMovies] = useState([]);
  //key from .env
  const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;
  //to navigate
  const navigate = useNavigate();

  useEffect(() => {
    //function to fetch genres from TMDB API
    const fetchGenres = async () => {
      try {
        //API call to get genres
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list?language=en",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${tmdbKey}`,
            },
          }
        );
        //set genres state with the fetched data
        setGenres(response.data.genres);
      } catch (error) {
        //console any errorr
        console.error(error);
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${tmdbKey}`,
            },
          }
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    //call the functions to fetch genres and movies when the component mounts

    fetchGenres();
    fetchMovies();
  }, [tmdbKey]); //restart when the tmdbKey changes

  return (
    <>
    <div className="container my-5">
      <h2 className="mb-5 text-white fs-5">Browse by Genre</h2>
      <div className="row ">
        {genres
          .filter((genre) =>
            movies.some((movie) => movie.genre_ids.includes(genre.id))
          ) // Filter out genres with no related movies
          .map((genre) => {
            const genreMovies = movies.filter((movie) =>
              movie.genre_ids.includes(genre.id)
            );
            const randomMovie =
              genreMovies[Math.floor(Math.random() * genreMovies.length)];
            const posterUrl = randomMovie
              ? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`
              : `https://via.placeholder.com/150?text=${genre.name}`;

            return (
              <div key={genre.id} className="col-md-3 mb-4 zoom-on-hover">
                <div
                  className="card h-100 text-center bg-black text-white p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/genre/${genre.id}`)} //redirect to the genre page on click
                >
                  <img
                    src={posterUrl} //use the random movie's poster image
                    className="card-img-top"
                    alt={genre.name} //set the alt text to the genre name
                  />
                  <div className="card-body">
                    <h5 className="card-title">{genre.name}</h5>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
    </>
  );
};

export default GenrePage;
