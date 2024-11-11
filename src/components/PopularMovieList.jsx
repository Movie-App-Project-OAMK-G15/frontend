import { useState } from "react"

const PopularMovieList = ({movieList, setMovieList}) => {
    return (
        <>
            {movieList.map(item => 
            <div className="movie-item" key={item.id}>
                <img src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`} alt="Movie Poster" />
                <p className="movie-title">{item.title}</p>
            </div>)}
        </>
    )
}

export default PopularMovieList