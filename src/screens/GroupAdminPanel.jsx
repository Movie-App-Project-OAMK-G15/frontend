import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUser } from "../context/useUser"
import '../styles/GroupAdminPanel.css'
import axios from "axios"
const backendLink = import.meta.env.VITE_API_URL

export default function GroupAdminPanel(){
    const {groupId} = useParams()
    const [subs, setSubs] = useState([])
    const [requests, setRequests] = useState([])
    const {user, currentGroup, getGroupById} = useUser()
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchData() {
            try {
                await getGroupById(groupId)
                await getMyRequsets(groupId)
                await getSubs(groupId)
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Failed to load group data.");
            }
        }
        fetchData();
    }, [])

    async function getSubs(groupId) {
        try {
            const groupIdForReq = {
                group_id: parseInt(groupId)
            }
            const json = JSON.stringify(groupIdForReq)
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };  
            const response = await axios.post(backendLink + '/group/getfollowers', json, headers)
            setSubs(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function getMyRequsets(groupId) {
        try {
            const groupIdForReq = {
                group_id: parseInt(groupId)
            }
            const json = JSON.stringify(groupIdForReq)
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };  
            const response = await axios.post(backendLink + '/group/requestsforgroup', json, headers)
            setRequests(response.data)
            console.log(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function approveRequest(req_id){
        try {
            const reqId = {
                req_id: parseInt(req_id)
            }
            const json = JSON.stringify(reqId)
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };
            const response = await axios.post(backendLink + '/group/approverequest', json, headers)
            setSubs((prevSubs) => [...prevSubs, response.data[0]]);
            setRequests((prevRequests) =>
                prevRequests.filter((req) => req.request_id !== req_id)
            );
            console.log(response.data)
        } catch (error) {
            alert(error)
        }
    }

    async function rejectRequest(req_Id) {
        try {
            const reqId = {
                req_id: parseInt(req_Id)
            }
            const json = JSON.stringify(reqId)
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };
            const response = await axios.post(backendLink + '/group/rejectrequest', json, headers)
            console.log(response.data)
            setRequests((prevRequests) =>
                prevRequests.filter((req) => req.request_id !== req_Id)
            );
        } catch (error) {
            alert(error)
        }
    }

    async function removeFromTheGroup(mail) {
        try {
            const usermail = {
                email: mail
            }
            const json = JSON.stringify(usermail)
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };
            const response = await axios.post(backendLink + '/group/removeuser', json, headers)
            if(response.data.status){
                alert('user has been deleted')
                setSubs(subs.filter(sub => sub.email != mail))
            }
        } catch (error) {
            alert(error)
        }
    }

    async function deleteGroup() {
       try {
        const json = JSON.stringify({group_id: groupId})
        const headers = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${user.token}`
            }
        };
        const response = await axios.post(backendLink + '/group/deletegroup', json, headers)
        if(response.data.status){
            alert('group has been deleted')
            navigate('/groups')
        }
       } catch (error) {
        alert(error)
       } 
    }

    return (
        <>
        <Navbar/>
        <h2>Admin Panel for <p className="group-name">{currentGroup.map(group => group.group_name).join(", ")}</p></h2>
        <button className="request-button" onClick={() => navigate(`/groups/${groupId}`)}>View group</button>
        <button className="request-button" onClick={deleteGroup}>Delete group</button>
        <div className="group-header">
            <p>Requests to join the group:</p>
        </div>
        <div className="requests-container">
            {requests.length > 0 ? (requests.map((req, index) => (
                <div className="request-card" key={index}>
                    <div className="request-name">
                        {req.firstname} {req.familyname}
                    </div>
                    <button className="request-button" onClick={() => rejectRequest(req.request_id)}>
                        Reject Request
                    </button>
                    <button className="request-button" onClick={() => approveRequest(req.request_id)}>
                        Approve Request
                    </button>
                </div>
            ))) : <div>No requests</div>}
        </div>
        <div className="group-header">
            <p>Subscribers:</p>
        </div>
        <div className="requests-container">
            {subs.length ? (subs.map((sub, index) => (
                <div className="request-card" key={index}>
                <div className="request-name">
                    {sub.firstname} {sub.familyname}
                </div>
                <button className="request-button" onClick={() => removeFromTheGroup(sub.email)}>
                    Remove from the group
                </button>
            </div>
            ))) : <div>No followers</div>}
        </div>
        </>
    )
}