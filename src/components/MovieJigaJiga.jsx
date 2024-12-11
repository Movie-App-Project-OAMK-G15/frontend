import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import '../styles/movieZigaZiga.css'

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', fontSize: '36px', right: '10px', color: 'orange' }}
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
      style={{ ...style, display: 'block', fontSize: '36px', left: '10px', color: 'orange' }}
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
       <div key={movie.id} className="col-md-3 mb-4 zoom-on-hover">
       <Link to={`/movie/${movie.id}`} className="text-decoration-none">
         <div className="card h-100 bg-black text-center p-3 mx-2 text-white" style={{ cursor: "pointer" }}>
           <img
             src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
             className="card-img-top "
             style={{ objectFit: 'cover', height: '300px' }}
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
    </Slider>
  </div>
  );
}

export default DynamicSlides;