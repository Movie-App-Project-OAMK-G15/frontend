import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import axios from 'axios';
const backendLink = import.meta.env.VITE_API_URL;

export default function UserGroups() {
    const [myGroups, setMyGroups] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        async function getInfo() {
            try {
                await getMyGroups();
            } catch (error) {
                alert(error);
            }
        }
        getInfo();
    }, []);

    async function getMyGroups() {
        try {
            const json = JSON.stringify({ user_email: user.email });
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };
            const response = await axios.post(backendLink + '/group/getusergroups', json, headers);
            console.log(response.data);
            setMyGroups(response.data);
        } catch (error) {
            alert(error);
        }
    }

    function viewGroupPage(group_id) {
        navigate(`/groups/${group_id}`);
    }

    return (
        <>
            <Navbar />            
            <h2 className="text-white text-center mb-4">Groups to which you are subscribed:</h2>
            <div
                className="d-flex justify-content-center align-items-center min-vh-100 w-100"
                style={{ overflowX: "hidden" }}
            >
              <div className="groups-container row w-100 justify-content-center align-items-center" >

            {myGroups.map((group) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 mb-4" key={group.group_id}>
                    <div
                    className="card "
                    style={{
                        backgroundColor: "#343a40", // Dark background for card
                        borderRadius: "5px",
                        border: "1px solid orange", // Optional: Add border for consistency
                        maxWidth: "700px" 
                    }}
                    >
                    <div className="card-body text-center d-flex flex-column align-items-center">
                    <img 
                        className="card-img-top mb-3"
                        src={group.photo || "https://via.placeholder.com/150x150/e0fff/FFF?text=No+photo+available+yet+:("} 
                        alt={`${group.group_name} photo`} 
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "50%", // Circular shape
                            border: "2px solid white", // Optional border for better visual contrast
                          }}
                    />
                    <h5 className="card-title text-warning">{group.group_name}</h5>
                    <p className="card-text text-light">{group.description}</p>
                    <div>
                        <button 
                            className="btn btn-primary mt-2" 
                            onClick={(e) => {
                                e.stopPropagation();
                                viewGroupPage(group.group_id);
                            }}
                        >
                            View page
                        </button>
                    </div>
                </div> 
                </div>
                </div>
            ))}
            </div>
            </div>
        </>
    );
}
