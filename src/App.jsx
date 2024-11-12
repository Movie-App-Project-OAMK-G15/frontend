import Home from "./components/Home"
import Screenings from "./components/Screenings"
import BrowseMovies from "./components/BrowseMovies"
import Navbar from "./components/Navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screenings" element={<Screenings />} />
        <Route path="/search" element={<BrowseMovies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
