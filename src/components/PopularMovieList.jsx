const PopularMovieList = ({movieList, setMovieList}) => {
    return (
        <>
            {movieList.map(item => <img key={item.id} src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`} alt="Movie Poster" />)}
        </>
    )
}

export default PopularMovieList