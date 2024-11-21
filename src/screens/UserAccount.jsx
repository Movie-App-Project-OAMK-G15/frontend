import { useUser } from "../context/useUser";
import Navbar from "../components/Navbar";
import FavMovies from "../components/FavMovies";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserAccount() {
    const { user, logOut, deleteAccount } = useUser();
    const navigate = useNavigate();

    //making sure user wants to delete an account
    function handleDelete() {
        if (confirm("Are you sure you want to delete this account?")) {
            deleteAccount();
        } else {
            console.log("User canceled the action.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">User Account</h5>
                        <p className="card-text"><strong>First Name:</strong> {user.firstname}</p>
                        <p className="card-text"><strong>Family Name:</strong> {user.familyname}</p>
                        <p className="card-text"><strong>Email:</strong> {user.email}</p>
                        <button className="btn btn-danger me-2" onClick={handleDelete}>Delete account</button>
                        <button className="btn btn-secondary me-2" onClick={logOut}>Log Out</button>
                        <button className="btn btn-primary" onClick={() => navigate('/account/creategroup')}>Create group</button>
                    </div>
                </div>
                <FavMovies />
            </div>
        </>
    );
}