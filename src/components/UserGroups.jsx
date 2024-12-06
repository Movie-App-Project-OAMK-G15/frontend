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
            <h2>Groups to which you are subscribed:</h2>
            {myGroups.map((group) => (
                <div className="group-item" key={group.group_id}>
                    <img 
                        className="group-image"
                        src={group.photo || "https://via.placeholder.com/150x150/e0fff/FFF?text=No+photo+available+yet+:("} 
                        alt={`${group.group_name} photo`} 
                    />
                    <div className="group-details">
                        <p className="group-name">{group.group_name}</p>
                        <p className="group-description">{group.description}</p>
                    </div>
                    <div>
                        <button 
                            className="subscribe-button" 
                            onClick={(e) => {
                                e.stopPropagation();
                                viewGroupPage(group.group_id);
                            }}
                        >
                            View page
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
}
