import { useState } from 'react'
import { UserContext } from './UserContext'
import axios from 'axios'
const url = import.meta.env.VITE_API_URL

export default function UserProvider({children}) {
    const [currentGroup, setCurrentGroup] = useState([])
    const [groups, setGroups] = useState([])
    const userfromSessionStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userfromSessionStorage ? JSON.parse(userfromSessionStorage) : {id: "", firstname: "", familyname: "", email: '', password: ''})

    const getToken = () => {
        const token = JSON.parse(sessionStorage.getItem('user'))
        if(token.token){
            return token.token
        }
        return null
    }

    async function confirmEmail(userToken) {
        try {
            const json = JSON.stringify({token: userToken})
            const headers = {headers: {"Content-Type": 'application/json'}}
            const response = await axios.post(url + '/user/verifyemail', json, headers)
            if(response.data.successMessage){
                alert('kongratulation')
            }
        } catch (error) {
            alert(error)
        }
    }

    const signUp = async () => {
        const json = JSON.stringify(user)
        const headers = {headers: {"Content-Type": 'application/json'}}
        try {
            const response = await axios.post(url + '/user/register', json, headers)
            console.log(response.data)
            setUser({id: "", firstname: "", familyname: "", email: '', password: ''})
        } catch(error) {
            console.log(error)
            throw error
        }
    }

    const signIn = async () => {
        const json = JSON.stringify(user)
        const headers = {headers: {"Content-Type": 'application/json'}}
        try{
            const response = await axios.post(url + '/user/login', json, headers)
            console.log(response.data)
            setUser(response.data)
            sessionStorage.setItem("user", JSON.stringify(response.data))
        }catch(error) {
            setUser({id: "", firstname: "", familyname: "", email: '', password: ''})
            throw error
        }
    }

    const deleteAccount = async() => {
        const json = JSON.stringify(user)
        const headers = {headers: {"Content-Type": 'application/json', "Authorization": `${user.token}`}}
        try{
            const response = await axios.post(url + '/user/delete', json, headers)
            console.log(response.data)
            if(response.data.state){
                logOut()
            } else alert('Error occured, try again later')
        }catch(error) {
            setUser({id: "", firstname: "", familyname: "", email: '', password: ''})
            throw error
        }
    }

    const logOut = () => {
        try {
            sessionStorage.removeItem('user');
            setUser({id: "", firstname: "", familyname: "", email: '', password: ''})
        } catch(error) {
            throw error
        }
    }

    const getGroups = async() => {
        try {
            const res = await axios.get(url + '/group/getgroups')
            setGroups(res.data)
        } catch (error) {
            throw error
        }
    }

    const getGroupById = async(group_id) => {
        try {
            const json = JSON.stringify({group_id: group_id})
            const headers = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.token}`
                }
            }; 
            const res = await axios.post(url + '/group/groupbyid', json, headers)
            console.log(res.data)
            setCurrentGroup(res.data)
        } catch (error) {
            throw error
        }
    }

    const updateBio = (newBio) => {
        setUser (prevUser  => ({
            ...prevUser ,
            bio: newBio
        }));
    };

        return (
            <UserContext.Provider value={{user, confirmEmail, setUser, signUp, signIn, logOut, getToken, deleteAccount, getGroups, groups, setGroups, updateBio, getGroupById, currentGroup}}>
                { children }
            </UserContext.Provider>
        )
}