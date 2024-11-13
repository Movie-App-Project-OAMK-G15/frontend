import Home from "./components/Home"
import Screenings from "./components/Screenings"
import BrowseMovies from "./components/BrowseMovies"
import Navbar from "./components/Navbar"
import GenreMoviesPage from "./components/GenreMoviePage"
import Authentication from "./screens/Authentication"
import { AuthenticationMode } from "./screens/Authentication"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screenings" element={<Screenings />} />
        <Route path="/search" element={<BrowseMovies />} />
      </Routes>
    </>
  );
}

export default App
