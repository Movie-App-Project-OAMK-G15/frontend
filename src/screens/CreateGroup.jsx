import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ErrorNotification from "../components/ErrorNotification"
import { useUser } from "../context/useUser"
import Navbar from "../components/Navbar"
import 'bootstrap'
const url = import.meta.env.VITE_API_URL

export default function CreateGroup(){
    //custom notification/error message state
    const [notificationMessage, setNotificationMessage] = useState(null)
    //custom notification/error type
    const [type, setType] = useState("")
    const [gName, setGname] = useState("")
    const [gDesc, setGdesc] = useState("")
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [groupPhoto, setGroupPhoto] = useState(null);
    const navigate = useNavigate()
    const {user} = useUser() 
    
    const handleFileChange = (event) => {
        setGroupPhoto(event.target.files[0]);
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!gName.trim() || !gDesc.trim() || !groupPhoto) {
            setNotificationMessage("All fields are required. Please fill out every field.");
            setType("error");
            setTimeout(() => {
                setNotificationMessage(null);
                setType("");
            }, 3000);
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        formData.append("adm_mail", user.email);
        formData.append("g_name", gName);
        formData.append("description", gDesc);
        formData.append("photo", groupPhoto);
    
        try {
            console.log("Sending form data:", formData);
            const response = await axios.post(
                `${url}/group/newgroup`,
                formData,
                { headers: { Authorization: `${user.token}` } }
            );
            console.log("Response:", response.data);
            if (response.data.state) {
                setLoading(false);
                setResponseData(response.data.state);
                alert(response.data.state);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("Error creating group:", error);
            setNotificationMessage('Error occurred while creating the group. Try to log in again');
            setType('error');
        } finally {
            setLoading(false); // Ensure loading stops
        }
    };
    
    return (
        <>
            <Navbar/>
            <ErrorNotification message={notificationMessage} type={type}/>
            <h2>Create new group</h2>
            {loading && <div className="alert alert-info text-center">Creating your group...</div>}
            {responseData && (
                <div className="alert alert-success text-center">
                    <h3>New group has been created!</h3>
                    <button className="btn btn-primary" onClick={() => navigate(`/groups`)}>View groups page</button>
                </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
            <div className="mb-3">
                <label htmlFor="group_name" className="form-label text-black">
                    Group Name: <span className="text-danger">*</span>
                </label>
                <input
                    id="group_name"
                    type="text"
                    value={gName}
                    onChange={(event) => setGname(event.target.value)}
                    className="form-control"
                    placeholder="Enter the group name"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="group_description" className="form-label text-black">
                    Group Description: <span className="text-danger">*</span>
                </label>
                <textarea
                    id="group_description"
                    value={gDesc}
                    onChange={(event) => setGdesc(event.target.value)}
                    className="form-control"
                    rows="4"
                    placeholder="Enter the group description"
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="group_photo" className="form-label text-black">
                    Group Photo: <span className="text-danger">*</span>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                    id="group_photo"
                />
            </div>
            <div className="text-center">
            {!loading && 
                <button id="create_group_submit" className="btn btn-primary">
                    Create Group
                </button>
            }
            </div>
        </form>


        </>
    )
}