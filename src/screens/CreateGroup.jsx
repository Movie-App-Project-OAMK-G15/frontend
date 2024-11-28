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
        // const groupInfo = {
        //     adm_mail: `${user.email}`,
        //     g_name: gName,
        //     description: gDesc,
        //     photo: groupPhoto,
        // }
        // console.log(groupInfo)
        // const json = JSON.stringify(groupInfo)
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Group name:</label>
                    <input id='group_name' type='text' value={gName} onChange={event => setGname(event.target.value)}/>
                </div>
                <div>
                    <label>Group description:</label>
                    <input id='email_field' type='text' value={gDesc} onChange={event => setGdesc(event.target.value)}/>
                </div>
                <div>
                    <label>Group Photo</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <div>
                    <button id="create_group_submit">Create</button>
                </div>
            </form>
        </>
    )
}