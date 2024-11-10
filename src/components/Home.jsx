import Slider from "./Slider.jsx";
import PopularMovieList from "./PopularMovieList.jsx";
import { useEffect, useState } from "react";
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY

const Home = () => {
    const [movieList, setMovieList] = useState([])
    useEffect(() => {
        const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbKey}`
        }
        };

        fetch(url, options)
        .then(res => res.json())
        .then(data => {
            console.log(data.results)
            setMovieList(data.results)
        })
        .catch(err => console.error(err));
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
                <PopularMovieList movieList={movieList} setMovieList={setMovieList}/>
            </div>
        </>
    )
};
  
export default Home;