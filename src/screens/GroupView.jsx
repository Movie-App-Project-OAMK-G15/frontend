import { useUser } from "../context/useUser"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "bootstrap"
import axios from "axios"
import Navbar from "../components/Navbar"
import '../styles/GroupView.css'
const url = import.meta.env.VITE_API_URL

export default function GroupView(){
    const {currentGroup, getGroupById, user} = useUser()
    const [subs, setSubs] = useState([])
    const {groupId} = useParams()
    useEffect(() => {
        getGroupById(groupId)
        getSubsForGroup()
    }, [])

    async function getSubsForGroup() {
        try {
            const json = JSON.stringify({group_id: groupId})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`,
                }
            };        
        
            const response = await axios.post(url + '/group/getfollowers', json, headers)
            console.log(response.data)
            setSubs(response.data)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
    <Navbar />
    {currentGroup.map((item) => (
        <div key={item.group_id} className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-9">
                    <div className="p-3 shadow-sm bg-white rounded">
                        {/* Group Header Section */}
                        <div className="d-flex align-items-center">
                            <img 
                                src={`/server${item.photo}` || "https://via.placeholder.com/100x100"} 
                                alt={`${item.group_name} logo`} 
                                className="group-image img-fluid rounded"
                            />
                            <div className="ms-4">
                                <h2 className="group-name mb-1">{item.group_name}</h2>
                                <p className="group-description text-muted mb-0">{item.description}</p>
                            </div>
                            <div className="ms-auto">
                                <button className="btn btn-danger">Unfollow</button>
                            </div>
                        </div>
                    </div>

                    {/* Subscribers Section */}
                    <div className="mt-3 d-flex justify-content-end">
                        <div className="subscribers-container p-3 shadow-sm bg-white rounded">
                            <p className="fw-bold mb-3">
                                Subscribers <span className="text-muted">({subs.length})</span>
                            </p>
                            <div className="d-flex flex-wrap">
                                {subs.slice(0, 8).map((sub, index) => (
                                    <div 
                                        key={index} 
                                        className="subscriber-box text-center me-3 mb-3"
                                    >
                                        <img 
                                            src={sub.photo ? `/server${sub.photo}` : "https://via.placeholder.com/50x50"} 
                                            alt={`${sub.firstname} photo`} 
                                            className="subscriber-photo rounded-circle"
                                        />
                                        <p className="subscriber-name mt-2">{sub.firstname}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ))}
</>

    
    )
}