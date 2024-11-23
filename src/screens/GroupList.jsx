import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import '../styles/Groups.css'
import { useUser } from "../context/useUser";
const backendLink = import.meta.env.VITE_API_URL

export default function GroupList(){
    //const [groups, setGroups] = useState([])
    const {user, groups, getGroups} = useUser()
    //navigation
    const navigate = useNavigate()
    useEffect(() => {
        getGroups()
    }, [])

    async function handleSubscribe(groupId){

    }

    function navToGroup(id){
        navigate(`/groups/${id}`)
    }
    return (
        <>
            <Navbar/>
            <h2>List of available groups</h2>
            <div className="groups-container">
                {groups.map((group) => (
                    <div className="group-item" key={group.group_id} onClick={() => navToGroup(group.group_id)}>
                    <img 
                        className="group-image"
                        src={`/server${group.photo}` || "https://via.placeholder.com/150x150/e0fff/FFF?text=No+photo+available+yet+:("} 
                        alt={`${group.group_name} photo`} 
                    />
                    <div className="group-details">
                        <p className="group-name">{group.group_name}</p>
                        <p className="group-description">{group.description}</p>
                    </div>
                    {user.token ? <button className="subscribe-button" onClick={() => handleSubscribe(group.group_id)}>
                            Subscribe
                    </button> : <button className="subscribe-button">Log in to subscribe</button>}
                    </div>
                ))}
            </div>
        </>
    )
}