import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../context/useUser";
const backendLink = import.meta.env.VITE_API_URL;
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

const FavMovies = () => {
  //get user from UserContext
  const { userId } = useParams();
  const { user } = useUser();
  //store favorite movies
  const [movies, setMovies] = useState([]);
  //retrieve user ID from user context

  useEffect(() => {
    fetchMovesById();
  }, []);

  async function fetchMovesById() {
    try {
      const result = await axios.get(backendLink + `/user/favorites/${userId}`);
      const userFavMovies = result.data;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbKey}`,
        },
      };
      const movieDetailsRequests = userFavMovies.map((item) =>
        axios.get(
          `https://api.themoviedb.org/3/movie/${item.movie_id}`,
          options
        )
      );

      //wait for all requests to complete
      const movieDetailsResponses = await Promise.all(movieDetailsRequests);
      //extract data from responses
      setMovies(movieDetailsResponses);
    } catch (error) {
      alert(error);
    }
  }

  const handleShare = (movie) => {
    //construct the URL to be shared using the movie's ID
    const shareUrl = `${window.location.origin}/movie/${movie.id}`;

    //check if the Web Share API is available in the browser
    if (navigator.share) {
      //use the Web Share API to share the movie details
      navigator
        .share({
          //title of the share
          title: movie.title,
          //text to accompany the share
          text: `Check out this movie: ${movie.title}`,
          //URL to be shared
          url: shareUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      //fallback for browsers that do not support the Web Share API
      //copy the share URL to the clipboard
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("URL copied to clipboard!");
        })
        .catch((err) => {
          alert("Failed to copy URL: " + err);
        });
    }
  };

  const handleShareList = (movie) => {
    //construct the URL to be shared using the user''s ID
    const shareUrl = `${window.location.origin}/account/favmovies/${userId}`;

    //check if the Web Share API is available in the browser
    if (navigator.share) {
      //use the Web Share API to share the movie details
      navigator
        .share({
          //title of the share
          title: movie.title,
          //text to accompany the share
          text: `Check out this movie: ${movie.title}`,
          //URL to be shared
          url: shareUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      //fallback for browsers that do not support the Web Share API
      //copy the share URL to the clipboard
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("URL copied to clipboard!");
        })
        .catch((err) => {
          alert("Failed to copy URL: " + err);
        });
    }
  };



  return (
    <div>
      <Navbar />
      <div className="container my-4 text-white">
        <h2 className="mb-4">My Favorite Movies</h2>
        <button className="btn btn-primary" onClick={handleShareList}>
          Share Favorite Movies List
        </button>
        <div className="row">
          {movies.map((movie, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.data.poster_path}`} // Movie poster image
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.data.title}</h5>
                  <p className="card-text">Rating: {movie.data.vote_average}</p>
                  <button
                    onClick={() => handleShare(movie.data)}
                    className="btn btn-primary"
                  >
                    Share
                  </button>
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
