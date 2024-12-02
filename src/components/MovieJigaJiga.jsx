import { useState } from "react";
import Slider from "react-slick";
import '../styles/Slider.css'

function DynamicSlides({movies}) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 3,
        arrows:true
      };

      movies.map(movie => console.log(movie))
      return (
        <div className="slider-container">
          <Slider {...settings}>
            {movies.map(movie => 
              <div>
                 <img
                        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                        className="card-img-top"
                      alt={movie.title}
                 />
                 <p>{movie.title}</p>
              </div>
            )}
          </Slider>
        </div>
      );
}

export default DynamicSlides;
