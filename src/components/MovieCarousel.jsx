const PopularMovieList = ({movieList, setMovieList}) => {
    return (
        <>
            {movieList.map(item => 
            <div key={item.id} className="movie-item">
                <img src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`} alt="Movie Poster" />
                <p className="movie-title">{item.title}</p>
            </div>)}
        </>
    )
}

export default PopularMovieList