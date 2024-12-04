import Navbar from "./Navbar"
import { useState, useEffect } from "react"
import { useUser } from "../context/useUser"
import axios from 'axios'
const backendLink = import.meta.env.VITE_API_URL

export default function UserOwnGroups(){
    const [myOwnGroups, setMyOwnGroups] = useState([])
    const {user} = useUser()
    useEffect(() => {
        async function getInfo() {
            try {
                await getMyOwnGroups()
            } catch (error) {
                alert(error)
            }
        }
        getInfo()
    }, [])
    async function getMyOwnGroups() {
        try {
            const json = JSON.stringify({admin_email: user.email})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            };
            const response = await axios.post(backendLink + '/group/getuserowngroups', json, headers)
            console.log(response.data)
            setMyOwnGroups(response.data)
           } catch (error) {
            alert(error)
           } 
    }
    return (
        <>
        <Navbar/>
        <h2>Groups that you own:</h2>
        {myOwnGroups.map(group => group.group_name)}
        </>
    )
}