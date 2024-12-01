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

    const [editMode, setEditMode] = useState(false) // State for toggle edit mode
    const [groupName, setGroupName] = useState("") // State for group name
    const [groupDescription, setGroupDescription] = useState("") // State for group description
    const [groupPhoto, setGroupPhoto] = useState(null) // State for group photo

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
                setSubs(subs.filter(sub => sub.email !== mail))
            }
        } catch (error) {
            alert(error)
        }
    }

    async function deleteGroup() {
        if(!window.confirm('Are you sure you want to delete your group?')){
            return
        }
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

    // Toggle edit mode and pre-fill data
    const handleEditClick = () => {
        setEditMode(true)
        const group = currentGroup[0]; // Assuming only one group is returned
        console.log(group)
        setGroupName(group.group_name)
        setGroupDescription(group.description)
        //setGroupPhoto(group.photo) // Placeholder for group photo, may be updated when admin uploads a new photo
    }

    const handleCancelEdit = () => {
        setEditMode(false)
    }

    async function handleEdit(e) {
        e.preventDefault()
        try {
            const group = currentGroup[0];
            const headers = {
                headers: {
                    "Authorization": `${user.token}`
                }
            };

            const formData = new FormData();
            formData.append("group_name", groupName); 
            formData.append("description", groupDescription);        
            formData.append("group_id", groupId);  
            formData.append("photo", groupPhoto == null ? group.photo : groupPhoto);

            const response = await axios.post(backendLink + '/group/editinfo', formData, headers)
                if(response.data.status){
                    alert('group info has been edited')
                    navigate(`/groups/${groupId}`);
                }else{
                    alert('Something went wrong')
                    return
                }
        } catch (error) {
            alert(error)
        }
    }

    const handleFileChange = (event) => {
        setGroupPhoto(event.target.files[0]);
    }

    // UI for group editing
    return (
        <>
        <Navbar />
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Header Section */}
                <div className="d-flex align-items-center">
                    {/* Group Image */}
                    <img
                        src={`${currentGroup.map(group => group.photo)}`}
                        alt="Group"
                        className="rounded-circle border me-3"
                        style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                    />
                    {/* Group Name */}
                    <h5 className="mb-0">
                        Admin Panel for <span className="text-primary">{currentGroup.map(group => group.group_name).join(", ")}</span>
                    </h5>
                </div>
                {/* Action Buttons */}
                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate(`/groups/${groupId}`)}>View Group</button>
                    <button className="btn btn-danger" onClick={deleteGroup}>Delete Group</button>
                </div>
            </div>

            {/* Edit Button */}
            <div className="text-end">
                <button className="btn btn-primary" onClick={handleEditClick}>Edit Group</button>
            </div>

            {editMode ? (
                <div className="mt-4">
                    <h3>Edit Group Details</h3>
                    <form onSubmit={handleEdit}>
                        {/* Group Name */}
                        <div className="mb-3">
                            <label htmlFor="group_name" className="form-label">Group Name:</label>
                            <input
                                id="group_name"
                                type="text"
                                className="form-control"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Enter group name"
                            />
                        </div>

                        {/* Group Description */}
                        <div className="mb-3">
                            <label htmlFor="group_description" className="form-label">Group Description:</label>
                            <textarea
                                id="group_description"
                                className="form-control"
                                rows="4"
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                                placeholder="Enter group description"
                            />
                        </div>

                        {/* Group Photo */}
                        <div className="mb-3">
                            <label htmlFor="group_photo" className="form-label">Group Photo:</label>
                            <input
                                id="group_photo"
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Save and Cancel buttons */}
                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-success">Save Changes</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Requests Section */}
                    <div className="mt-4">
                        <h3>Requests to Join the Group:</h3>
                        <div className="list-group">
                            {requests.length > 0 ? (
                                requests.map((req, index) => (
                                    <div className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                        <span>{req.firstname} {req.familyname}</span>
                                        <div>
                                            <button className="btn btn-success btn-sm me-2" onClick={() => approveRequest(req.request_id)}>Approve</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => rejectRequest(req.request_id)}>Reject</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No pending requests</div>
                            )}
                        </div>
                    </div>

                    {/* Subscribers Section */}
                    <div className="mt-4">
                        <h3>Subscribers:</h3>
                        <div className="list-group">
                            {subs.length ? (
                                subs.map((sub, index) => (
                                    <div className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                                        <span>{sub.firstname} {sub.familyname}</span>
                                        <button className="btn btn-danger btn-sm" onClick={() => removeFromTheGroup(sub.email)}>Remove</button>
                                    </div>
                                ))
                            ) : (
                                <div>No followers</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>

        </>
    )
}
