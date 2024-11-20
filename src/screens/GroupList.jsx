import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import '../styles/Groups.css'
import { useUser } from "../context/useUser";
const backendLink = import.meta.env.VITE_API_URL

export default function GroupList(){
    const [groups, setGroups] = useState([])
    const {user} = useUser()
    useEffect(() => {
        fetch(backendLink + '/group/getgroups')
        .then(res => res.json())
        .then(data => setGroups(data))
    }, [])

    async function handleSubscribe(groupId){

    }
    return (
        <>
            <Navbar/>
            <h2>List of available groups</h2>
            <div className="groups-container">
                {groups.map((group) => (
                    <div className="group-item" key={group.group_id}>
                    <img 
                        className="group-image"
                        src={`/server${group.photo}` || "https://via.placeholder.com/150x150/e0fff/FFF?text=No+photo+available+yet+:("} 
                        alt={`${group.group_name} photo`} 
                    />
                    <div className="group-details">
                        <p className="group-name">{group.group_name}</p>
                        <p className="group-description">{group.description}</p>
                    </div>
                    <button className="subscribe-button" onClick={() => handleSubscribe(group.group_id)}>
                            Subscribe
                    </button>
                    </div>
                ))}
            </div>
        </>
    )
}