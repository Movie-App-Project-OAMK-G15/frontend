import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const UserChoice = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/user/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data.rows || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Error fetching users: " + error.message);
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
      <div className="container my-4">
        <h2 className="mb-4">People's Choice</h2>
        <div className="row">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {user.firstname} {user.familyname}
                    </h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleShowFavorites(user.id)}
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