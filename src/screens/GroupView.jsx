import { useUser } from "../context/useUser"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../components/Navbar"
import '../styles/GroupView.css'
const url = import.meta.env.VITE_API_URL

export default function GroupView(){
    const {groups, getGroups, user} = useUser()
    const {groupId} = useParams()
    useEffect(() => {
        getGroups()
        getSubs()
        console.log(groups)
    }, [])

    async function getSubs() {
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
            {groups.filter(group => group.group_id == groupId).map(item => 
                <div key={groupId} className="group-container">
                    <div className="group-header">
                        <img
                            src={"/server" + item.photo} // Group image
                            alt={`${item.group_name} logo`}
                            className="group-image"
                        />
                        <div className="group-info">
                            <h2 className="group-name">{item.group_name}</h2>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}