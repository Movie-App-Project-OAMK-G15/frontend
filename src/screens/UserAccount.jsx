import { useUser } from "../context/useUser";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import React, {useEffect} from "react";
import BioUpdate from "../components/BioUpdate";
import UserGroups from "../components/UserGroups";
import UserOwnGroups from "../components/UserOwnGroups";
import "../styles/UserAccount.css";
import UpdateProfilePic from "../components/ProfilePicUpdate";

export default function UserAccount() {
  const { user, logOut, deleteAccount } = useUser();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this account?")) {
      deleteAccount();
    } else {
      console.log("User  canceled the action.");
    }
  };
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/profile/${user.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: "My Profile",
          text: `Check out my profile on this awesome app!`,
          url: shareUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Profile URL copied to clipboard!");
        })
        .catch((err) => {
          alert("Failed to copy URL: " + err);
        });
    }
  };

    return (
        <>
            <div className="user-page">
                <Navbar />
                <div className="container mt-4 flex-grow-1">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-md-4">
                            <button
                                className="bttun btn-primary w-100 mb-3 d-md-none"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#sidebar"
                                aria-expanded="false"
                                aria-controls="sidebar"
                            >
                                +
                            </button>
                            <div className="collapse d-md-block" id="sidebar">
                                <div className="cardle shadow-sm mb-4">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">My Account</h5>
                                        <hr />
                                        <div className="mt-3">
                                            <div className="d-flex flex-column align-items-center">
                                                <button
                                                    className="btn btn-primary mb-2 w-100"
                                                    onClick={() => navigate('/account/creategroup')}
                                                >
                                                    Create Group
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary mb-2 w-100"
                                                    onClick={() => navigate(`/account/mygroups/${user.id}`)}
                                                >
                                                    My Groups
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary mb-2 w-100"
                                                    onClick={() => navigate(`/account/myowngroups/${user.id}`)}
                                                >
                                                    My Own Groups
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary mb-2 w-100"
                                                    onClick={() => navigate(`/account/favmovies/${user.id}`)}
                                                >
                                                    Favourite Movies
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary w-100"
                                                    onClick={() => navigate(`/reviews/user/${encodeURIComponent(user.email)}`)}
                                                >
                                                    My Reviews
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        
                        <div className="col-md-8">
                                <UpdateProfilePic />
                                <div className="card-body">
                                    <p className="card-text">
                                        <strong>First Name:</strong> {user.firstname}
                                    </p>
                                    <p className="card-text">
                                        <strong>Family Name:</strong> {user.familyname}
                                    </p>
                                    <p className="card-text">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <BioUpdate />
                                    <div className="d-flex justify-content-between mt-3">
                                        <button className="btn btn-danger" onClick={handleDelete}>
                                            Delete Account
                                        </button>
                                        <button className="btn btn-secondary" onClick={logOut}>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
