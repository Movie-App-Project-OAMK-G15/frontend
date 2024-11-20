import { Link } from 'react-router-dom';
import { useUser } from '../context/useUser';
import '../styles/Navbar.css'

const Navbar = () => {
  const {user} = useUser()
  return (
    <>
      <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/screenings">Movie screenings</Link></li>
        <li><Link to="/search">Browse movies</Link></li>
        <li><Link to="/groups">Groups</Link></li>
        {!user.token ? 
        <>
          <li><Link to="/signin">Sign in</Link></li>
          <li><Link to="/signup">Sign up</Link></li>
        </>
        : <li><Link to="/account">My account</Link></li>
        }
        
      </ul>
      </nav>
    </>
  );
};

export default Navbar;
