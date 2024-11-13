import Home from "./components/Home"
import Screenings from "./components/Screenings"
import BrowseMovies from "./components/BrowseMovies"
import Navbar from "./components/Navbar"
import Authentication from "./screens/Authentication"
import { AuthenticationMode } from "./screens/Authentication"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/screenings" element={<Screenings />} />
        <Route path="/search" element={<BrowseMovies />} />
        <Route path="/signin" element={<Authentication authenticationMode={AuthenticationMode.Login}/>}/>
        <Route path="/signup" element={<Authentication authenticationMode={AuthenticationMode.Register}/>}/>
      </Routes>
    </>
  );
}

export default App
