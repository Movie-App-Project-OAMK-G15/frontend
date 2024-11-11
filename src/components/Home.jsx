import Slider from "./Slider.jsx";
import MovieCarousel from "./MovieCarousel.jsx";
import '../styles/Home.css'
import { useEffect, useState } from "react";
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY

const Home = () => {
    const [movieList, setMovieList] = useState([])
    useEffect(() => {
        // test of the API, works only for this partcular endpoint
        const urls = [1, 2, 3].map(
            page => `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`
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
            <h2>Home Page</h2>
            <div className="App">
                <Slider images={images} />
            </div>
            <div>
                <h2>Top rated</h2>
                <div className="movie-grid">
                    <MovieCarousel movieList={movieList} setMovieList={setMovieList}/>
                </div>
            </div>
        </>
    )
};
  
export default Home;