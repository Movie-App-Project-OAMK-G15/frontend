import { useUser } from "../context/useUser";
import Navbar from "../components/Navbar";
import FavMovies from "../components/FavMovies";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React,{ useEffect } from "react";
import BioUpdate from "../components/BioUpdate";
import UserGroups from "../components/UserGroups";


export default function UserAccount() {
    const { user, logOut, deleteAccount } = useUser();
    const navigate = useNavigate();

    function handleDelete() {
        if (confirm("Are you sure you want to delete this account?")) {
            deleteAccount();
        } else {
            console.log("User canceled the action.");
        }
    }

    useEffect(() => {
        let profilePic = document.getElementById("profile-pic");
        let inputFile = document.getElementById("input-file");

        if (inputFile) {
            inputFile.onchange = function() {
                if (inputFile.files && inputFile.files[0]) {
                    profilePic.src = URL.createObjectURL(inputFile.files[0]);
                }
            };
        }

        return () => {
            if (inputFile) {
                inputFile.onchange = null;
            }
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">User  Account</h5>
                        <img src="images/profile.png" id="profile-pic" alt="Profile"/>
                        <input type="file" accept="image/jpeg, image/png, image/jgp" id="input-file"/>
                        <p className="card-text"><strong>First Name:</strong> {user.firstname}</p>
                        <p className="card-text"><strong>Family Name:</strong> {user.familyname}</p>
                        <p className="card-text"><strong>Email:</strong> {user.email}</p>
                        <BioUpdate />
                        <button className="btn btn-danger me-2" onClick={handleDelete}>Delete account</button>
                        <button className="btn btn-secondary me-2" onClick={logOut}>Log Out</button>
                        <button className="btn btn-primary" onClick={() => navigate('/account/creategroup')}>Create group</button>
                    </div>
                </div>
                <button onClick={() => navigate(`/account/favmovies/${user.id}`)}>Favourite movies</button>
                <button onClick={() => navigate(`/account/mygroups/${user.id}`)}>My groups</button>
            </div>
        </>
    );
}