import { useUser } from "../context/useUser"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import '../styles/GroupView.css'

export default function GroupView(){
    const {groups, getGroups} = useUser()
    const {groupId} = useParams()
    useEffect(() => {
        getGroups()
        console.log(groups)
    }, [])

    return (
        <>
            <Navbar/>
            {groups.filter(group => group.group_id == groupId)
            .map(item => 
                <div className="group-container">
                    <div className="group-header">
                        <img
                            src={"/server" + item.photo} // Group image
                            alt={`${item.group_name} logo`}
                            className="group-image"
                        />
                        <div className="group-info">
                            <h2 className="group-name">{item.group_name}</h2>
                        </div>
                        <button className="subscribe-button">Subscribe</button>
                    </div>
                </div>
            )}
        </>
    )
}