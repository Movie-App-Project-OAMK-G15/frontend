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