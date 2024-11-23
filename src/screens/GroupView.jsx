import { useUser } from "../context/useUser"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"

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
                <div>
                    <p>{item.group_name}</p>
                    <p>{item.description}</p>
                </div>
            )}
        </>
    )
}