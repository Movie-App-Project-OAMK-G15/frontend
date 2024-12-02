import Carousel from 'react-bootstrap/Carousel';
import '../styles/IndividualIntervalsExample.css'; // Custom CSS for height adjustment

function IndividualIntervalsExample({ movies }) {
  return (
    <div className="carousel-container">
      <Carousel>
        {movies
          .filter((movie) => movie.id !== 179387)
          .map((movie) => (
            <Carousel.Item key={movie.id} interval={5000}>
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                className="d-block w-100 custom-carousel-img"
                alt={movie.title}
              />
              <Carousel.Caption>
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
}

export default IndividualIntervalsExample;
