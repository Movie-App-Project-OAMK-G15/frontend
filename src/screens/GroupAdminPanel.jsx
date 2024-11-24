import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { useUser } from "../context/useUser"
export default function GroupAdminPanel(){
    const {groupId} = useParams()
    const {user, groups, getGroups} = useUser()
    return (
        <>
        <Navbar/>
        <h2>Admin panel</h2>
        </>
    )
}