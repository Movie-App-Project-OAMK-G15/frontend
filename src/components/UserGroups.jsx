import Navbar from "./Navbar"
import { useState, useEffect } from "react"
import { useUser } from "../context/useUser"
import axios from 'axios'
const backendLink = import.meta.env.VITE_API_URL

export default function UserGroups(){
    const [myGroups, setMyGroups] = useState([])
    const {user} = useUser()
    useEffect(() => {
        async function getInfo() {
            try {
                await getMyGroups()
            } catch (error) {
                alert(error)
            }
        }
        getInfo()
    }, [])

    async function getMyGroups() {
        try {
            const json = JSON.stringify({user_email: user.email})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };
            const response = await axios.post(backendLink + '/group/getusergroups', json, headers)
            console.log(response.data)
            setMyGroups(response.data)
           } catch (error) {
            alert(error)
           } 
    }

    return (
        <>
        <Navbar/>
        <h2>Groups to which u are subscribed:</h2>
        {myGroups.map(group => group.group_name)}
        </>
    )
}