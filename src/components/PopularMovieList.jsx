const PopularMovieList = ({movieList, setMovieList}) => {
    return (
        <>
            {movieList.map(item => <img src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`} alt="Movie Poster" />)}
        </>
    )
}

export default PopularMovieList