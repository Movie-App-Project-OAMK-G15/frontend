import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', fontSize: '24px', right: '10px', color: 'white' }}
      onClick={onClick}
    >
      &#9654; {/*unicode character for right arrow */}
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', fontSize: '24px', left: '10px', color: 'white' }}
      onClick={onClick}
    >
      &#9664; {/*unicode character for left arrow */}
    </div>
  );
};

function DynamicSlides({ movies }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {movies.map(movie => (
          <div key={movie.id} className="card mx-2">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                className="card-img-top"
                alt={movie.title}
              />
            </Link>
            <div className="card-body">
              <h5 className="card-title">{movie.title}</h5>
              <p className="card-text">Rating: {movie.vote_average}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default DynamicSlides;