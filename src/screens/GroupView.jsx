import { useUser } from "../context/useUser"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import "bootstrap"
import axios from "axios"
import Navbar from "../components/Navbar"
import '../styles/GroupView.css'
const url = import.meta.env.VITE_API_URL

export default function GroupView(){
    const {currentGroup, getGroupById, user} = useUser()
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
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
            <Navbar/>
            {currentGroup.map(item => 
            <div class="container mt-4">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-9">
                        <div class="d-flex align-items-center p-3 shadow-sm bg-white rounded">
                            <img src={`/server${item.photo}`} alt={`${item.group_name} logo`} class="group-image img-fluid rounded"/>
                            <div class="ms-4">
                                <h2 class="group-name mb-1">{item.group_name}</h2>
                                <p class="group-description text-muted mb-0">{item.description}</p>
                            </div>
                            <div class="ms-auto">
                                <button class="btn btn-danger">Unfollow</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            )}
        </>
    )
}