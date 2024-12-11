import { useUser } from "../context/useUser";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useEffect } from "react";
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

  useEffect(() => {
    const hamburger = document.querySelector("#toggle-btn-sidebar");
    const sidebar = document.querySelector("#sidebar")
    const optionBtn = document.querySelector("#option-btn");
    const subOption = document.querySelector("#sidebar-footer")

    const toggleSidebar = () => {
      sidebar.classList.toggle("expand");
    };

    const toggleSidebarFooter = () => {
      subOption.classList.toggle("expand")
    };

    hamburger.addEventListener("click", toggleSidebar)
    optionBtn.addEventListener("click", toggleSidebarFooter)

    return () => {
      hamburger.removeEventListener('click', toggleSidebar)
      optionBtn.removeEventListener('click', toggleSidebarFooter)
    }

  }, [])

  return (
    <>
        <Navbar />
        <div className="wrapper">
          <aside id="sidebar" className="sidebar">
            <div className="d-flex">
              <button id="toggle-btn-sidebar" type="button">
                <i class="bi bi-grid"></i>
              </button>
              <div className="sidebar-logo"><strong>Menu</strong></div>
            </div>
            <ul className="sidebar-nav">
              <li className="sidebar-item">
                <a href="/account/creategroup" className="sidebar-link">
                <i class="bi bi-building-add"></i>
                <span>Create group</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href={`/account/mygroups/${user.id}`} className="sidebar-link">
                <i class="bi bi-building"></i>
                <span>My groups</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href={`/account/myowngroups/${user.id}`} className="sidebar-link">
                <i class="bi bi-building-down"></i>
                <span>My own groups</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href={`/account/favmovies/${user.id}`} className="sidebar-link">
                <i class="bi bi-star-fill"></i>
                <span>My favorites</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href={`/reviews/user/${encodeURIComponent(user.email)}`} className="sidebar-link">
                <i class="bi bi-chat-square-dots"></i>
                <span>My Reviews</span>
                </a>
              </li>
              
            </ul>
            <li className="sidebar-item">
                <a href="#" id="option-btn" className="sidebar-link has-dropdown collapsed" data-bs-toggle="collapse" 
                data-bs-target="#options" aria-expanded="false" aria-controls="option">
                  <i class="bi bi-gear-wide"></i>
                  <span>options</span>
                </a>
                <ul id="options" className="sidebar-dropdown list-unstyled collapse" 
                data-bs-parent="#sidebar">
                  <li className="sidebar-item">
                    <a onClick={logOut} className="sidebar-link">
                      <i class="bi bi-box-arrow-left"></i>
                      Log Out
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a onClick={handleDelete} className="sidebar-link">
                      <i class="bi bi-trash3"></i>
                      Delete Account
                    </a>
                  </li>
                </ul>
              </li>
          </aside>
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
              <div className="d-flex share justify-content-between mt-3">
                <button
                  className="btn share-btn btn-outline-primary mb-2 w-100"
                  onClick={handleShare}
                >
                  <i class="bi bi-share"></i>
                  <span className="sharebtn">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>  
    </>
  );
}
