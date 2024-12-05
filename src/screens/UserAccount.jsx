import { useUser } from "../context/useUser";
import Navbar from "../components/Navbar";
import FavMovies from "../components/FavMovies";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from "react";
import BioUpdate from "../components/BioUpdate";
import UserGroups from "../components/UserGroups";
import UserOwnGroups from "../components/UserOwnGroups";
import "../styles/UserAccount.css"
import UpdateProfilePic from "../components/ProfilePicUpdate";

export default function UserAccount() {
    const { user, logOut, deleteAccount } = useUser ();
    const navigate = useNavigate();



    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this account?")) {
            deleteAccount();
        } else {
            console.log("User  canceled the action.");
        }
    };




    return (
        <body>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="container mt-4 flex-grow-1">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Profile Picture</h5>
                                    <UpdateProfilePic />
                                    <h2>___________________________</h2>
                                    <div className="mt-3">
                                        <div className="d-flex flex-column align-items-center">
                                            <button className="btn btn-primary mb-2" onClick={() => navigate('/account/creategroup')}>Create Group</button>
                                            <button className="btn btn-outline-secondary mb-2" onClick={() => navigate(`/account/mygroups/${user.id}`)}>My Groups</button>
                                            <button className="btn btn-outline-primary" onClick={() => navigate(`/account/favmovies/${user.id}`)}>Favourite Movies</button>
                                            <button className="btn btn-outline-primary" onClick={() => navigate(`/reviews/user/${encodeURIComponent(user.email)}`)}>My Reviews</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">User  Account</h5>
                                    <p className="card-text"><strong>First Name:</strong> {user.firstname}</p>
                                    <p className="card-text"><strong>Family Name:</strong> {user.familyname}</p>
                                    <p className="card-text"><strong>Email:</strong> {user.email}</p>
                                    <BioUpdate />
                                    <div className="d-flex justify-content-between mt-3">
                                        <button className="btn btn-danger me-2" onClick={handleDelete}>Delete Account</button>
                                        <button className="btn btn-secondary me-2" onClick={logOut}>Log Out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        
    );
}