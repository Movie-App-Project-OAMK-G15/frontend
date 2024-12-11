import Slider from "./Slider.jsx";
import PopularMovieList from "./PopularMovieList.jsx";
import GenresPage from "./GenrePage.jsx";
import Navbar from "./Navbar.jsx";
import IndividualIntervalsExample from "./BigCarousel.jsx";
import "../styles/Home.css";
import { useEffect, useState } from "react";
import "bootstrap";
import DynamicSlides from "./MovieJigaJiga.jsx";

const tmdbKey = import.meta.env.VITE_TMDB_API_KEY;

const Home = () => {
  const [movieList, setMovieList] = useState([]);
  const [popMovieList, setPopMovieList] = useState([]);
  const [upMovieList, setUpMovieList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data for all categories
        const [popular, nowPlaying, upcoming] = await Promise.all([
          fetchMovies("movie/top_rated", "popularity.desc"),
          fetchMovies("movie/now_playing"),
          fetchMovies("movie/upcoming"),
        ]);

        // Update states
        setMovieList(popular);
        setPopMovieList(nowPlaying);
        setUpMovieList(upcoming);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data.");
      }
    }

    fetchData();
  }, []);

  // Reusable function to fetch movies by category
  async function fetchMovies(endpoint, sort = "") {
    const urls = [1, 2].map(
      (page) =>
        `https://api.themoviedb.org/3/${endpoint}?include_adult=false&language=en-US&page=${page}&${
          sort ? `sort_by=${sort}` : ""
        }`
    );

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tmdbKey}`,
      },
    };

    try {
      const responses = await Promise.all(
        urls.map((url) => fetch(url, options).then((res) => res.json()))
      );

      // Combine results and filter duplicates by ID
      const allMovies = responses.flatMap((response) => response.results);
      return Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values());
    } catch (error) {
      console.error(`Error fetching movies from ${endpoint}:`, error);
      throw error;
    }
  }

  return (
    <>
      <Navbar />
      <div>
        <IndividualIntervalsExample movies={popMovieList} />
      </div>

<div>
  <h2 className="mt-5 mb-5 text-white fs-5">Top rated</h2>
  <div className="d-md-none">
    <IndividualIntervalsExample movies={movieList} />
  </div>
  <div className="d-none d-md-block">
    <DynamicSlides movies={movieList} />
  </div>
</div>

<div>
  <h2 className="mt-5 mb-5 text-white fs-5">Popular now</h2>
  <div className="d-md-none">
    <IndividualIntervalsExample movies={popMovieList} />
  </div>
  <div className="d-none d-md-block">
    <DynamicSlides movies={popMovieList} />
  </div>
</div>

<div>
  <h2 className="mt-5 mb-5 text-white fs-5">Upcoming</h2>
  <div className="d-md-none">
    <IndividualIntervalsExample movies={upMovieList} />
  </div>
  <div className="d-none d-md-block">
    <DynamicSlides movies={upMovieList} />
  </div>
</div>

      <GenresPage />
    </>
  );
};

export default Home;
