import Slider from "./Slider.jsx";
import PopularMovieList from "./PopularMovieList.jsx";
import GenresPage from "./GenrePage.jsx";
import Navbar from "./Navbar.jsx";
import IndividualIntervalsExample from "./BigCarousel.jsx";
import '../styles/Home.css'
import { useEffect, useState } from "react";
import 'bootstrap'
import DynamicSlides from "./MovieJigaJiga.jsx";
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY

const Home = () => {
    const [movieList, setMovieList] = useState([])
    useEffect(() => {
        // test of the API, works only for this partcular endpoint
        const urls = [1, 2].map(
            page => `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc`
          );  

        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbKey}`
          }
        };
        //have to use promise all as the endpoint provides 
        //info in 3 different urls 
        Promise.all(urls.map(url => fetch(url, options).then(res => res.json())))
            .then((responses) => {
                const allMovies = responses.flatMap(response => response.results);
                setMovieList(movieList.concat(allMovies))
            })
        .catch((error) => console.error(error));
    }, [])
    
    const images = [
        '/src/assets/pic1.jpg',
        '/src/assets/pic2.jpg',
        '/src/assets/pic3.jpg'
      ];

    return (
        <>
            <Navbar/>
            <div>
                <IndividualIntervalsExample movies={movieList}/>
            </div>
            <div>
                <h2  className="mt-4 mb-4 text-white">Popular now</h2>
                <DynamicSlides movies = {movieList}/>
            </div> 
            <div>
                <div className="movie-grid">
                    <PopularMovieList movieList={movieList} setMovieList={setMovieList}/>
                </div>
            </div>
            <GenresPage/>
            
            
        </>
    )
};
  
export default Home;