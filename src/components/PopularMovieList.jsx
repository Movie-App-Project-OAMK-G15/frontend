import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const PopularMovieList = ({ movieList, setMovieList }) => {
    //sort movies by rating in descending order
    const sortedMovies = [...movieList].sort((a, b) => b.vote_average - a.vote_average);

    return (
        <div className="container my-4">
            <h2 className="mb-4">Top Rated</h2>
            <div className="row">
                {sortedMovies.map((movie) => (
                    <div key={movie.id} className="col-md-3 mb-4">
                        <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                            <div className="card">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    className="card-img-top"
                                    alt={movie.title}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text">Rating: {movie.vote_average}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularMovieList;