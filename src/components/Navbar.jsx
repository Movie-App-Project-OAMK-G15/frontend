import { Link } from 'react-router-dom';
import { useUser } from '../context/useUser';
import { useEffect, useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid">
        {/* Brand Name */}
        <Link className="navbar-brand" to="/">
          MovieZone
        </Link>

        {/* Toggle Button for Small Screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-aligned menu items */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/screenings">
                Movie Screenings
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                Browse Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/groups">
                Groups
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/browsereviews">
                Reviews
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userChoice">
                People's Choices
              </Link>
            </li>
          </ul>

          {/* Right-aligned account-related links */}
          <ul className="navbar-nav ms-auto">
            {!user.token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/account">
                  <i class="bi bi-person-circle"></i>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
