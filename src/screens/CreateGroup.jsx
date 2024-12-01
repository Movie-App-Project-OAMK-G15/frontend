import axios from "axios"
import { useState } from "react"
import ErrorNotification from "../components/ErrorNotification"
import { useUser } from "../context/useUser"
import Navbar from "../components/Navbar"
const url = import.meta.env.VITE_API_URL

export default function CreateGroup(){
    //custom notification/error message state
    const [notificationMessage, setNotificationMessage] = useState(null)
    //custom notification/error type
    const [type, setType] = useState("")
    const [gName, setGname] = useState("")
    const [gDesc, setGdesc] = useState("")
    const [groupPhoto, setGroupPhoto] = useState(null);
    const {user} = useUser() 
    
    const handleFileChange = (event) => {
        setGroupPhoto(event.target.files[0]);
    }
    
    const handleSubmit = async(event) => {
        event.preventDefault()

        // Create FormData object to include the file and other data
        const formData = new FormData();
        formData.append("adm_mail", user.email); // Admin email
        formData.append("g_name", gName);        // Group name
        formData.append("description", gDesc);  // Group description
        formData.append("photo", groupPhoto);
        const headers = {
            headers: {
                "Authorization": `${user.token}`,
            }
        };    
        console.log(formData)    
        try{
            const response = await axios.post(url + '/group/newgroup', formData, headers)
            console.log(response.data)
            if(response.data.state){
                alert(response.data.state)
            } else alert('Error occured, try again later')
        } catch (error) {
            const message = error.message && error.response.data ? error.response.data.error : error
            setNotificationMessage('Error occured while creating the group. Try to log in again')//custom error notification
            setType('error')//notification type
            setTimeout(() => {
                setNotificationMessage(null)
                setType('')
              }, 3000)
        }
    }
    return (
        <>
            <Navbar/>
            <ErrorNotification message={notificationMessage} type={type}/>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <div className="mb-3">
                    <label htmlFor="group_name" className="form-label">
                        Group Name:
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
                    <label htmlFor="group_description" className="form-label">
                        Group Description:
                    </label>
                    <textarea
                        id="group_description"
                        value={gDesc}
                        onChange={(event) => setGdesc(event.target.value)}
                        className="form-control"
                        rows="4" // Adjust the size of the description field
                        placeholder="Enter the group description"
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="group_photo" className="form-label">
                        Group Photo:
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
                    <button id="create_group_submit" className="btn btn-primary">
                        Create Group
                    </button>
                </div>
            </form>

        </>
    )
}