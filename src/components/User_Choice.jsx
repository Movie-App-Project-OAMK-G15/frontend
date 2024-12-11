import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios'
const url = import.meta.env.VITE_API_URL

const UserChoice = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers(){
      try {
        const headers = {
          headers: {
              "Content-Type": "application/json",
          }
        }; 
        const response = await axios.get(url + '/user/all', headers);
        console.log("Fetched users:", response.data);
        setUsers(response.data);
      } catch (error) {
        alert("Error fetching users: " + error);
      }
    };

    fetchUsers();
  }, []); //dependency array ensures this runs only once

  const handleShowFavorites = (userId) => {
    //navigate to the user's favorite movies page
    navigate(`/account/favmovies/${userId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
  <h2 className="mb-5 text-white fs-5 text-center">People's Choice</h2>
  <div className="row">
    {users.length === 0 ? (
      <p className="text-white text-center w-100">No users found.</p>
    ) : (
      users.map((user, index) => (
        <div
          key={index}
          className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center"
        >
          <div className="card bg-dark text-white w-100 shadow d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
            <div className="card-body text-center">
              <h5 className="card-title mb-3">
                {user.firstname} {user.familyname}
              </h5>
              <button
              style={{
                backgroundColor: '#FFA500', // Primary blue color
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textTransform: 'uppercase',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = '#FFA300') // Darker blue on hover
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = '#FFA500') // Revert to original color
              }
              onMouseDown={(e) => {
                e.target.style.backgroundColor = '#FFA300'; // Even darker blue on active
                e.target.style.transform = 'translateY(1px)'; // Pressed effect
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
              }}
              onMouseUp={(e) => {
                e.target.style.backgroundColor = '#FFA300'; // Revert to hover color
                e.target.style.transform = 'translateY(-2px)'; // Lift effect
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
              }}
              onClick={() => handleShowFavorites(user.user_id)}
            >
              Show Favorite Movies
            </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>


    </>
  );
};

export default UserChoice;