import { useState } from 'react'
import { UserContext } from './UserContext'
import axios from 'axios'
import emailjs from 'emailjs-com'
emailjs.init(import.meta.env.VITE_EMAILJS_KEY);
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

    const getUserId = () => {
        const uID = JSON.parse(sessionStorage.getItem('uID'))
        if(uID){
            return uID
        }
        return null
    }

    const setUserId = (data) => {
        sessionStorage.setItem("uID", JSON.stringify(data))
    }

    async function confirmEmail(userToken) {
        try {
            const currentId = getUserId()
            console.log(currentId)
            const json = JSON.stringify({user_id: currentId, token: userToken})
            const headers = {headers: {"Content-Type": 'application/json'}}
            const response = await axios.post(url + '/user/verifyemail', json, headers)
            if(response.data.successMessage){
                sessionStorage.removeItem('uID');
                alert('kongratulation')
            }
        } catch (error) {
            alert(error)
        }
    }

    async function sendMail(mail, message) {
        const params = {
            sendername: "MovieZone",
            to: mail,
            subject: "Confirm your email",
            replyto: "maxvanholl75@gmail.com",
            message: message,
        };

        const serviceID = "service_uowz6vd";
        const templateID = "template_j5m8wg8";

        try {
            const response = await emailjs.send(serviceID, templateID, params);
            alert('Message has been sent successfully');
            console.log('Email response:', response);
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send email. Please try again.');
        }
    }

    const signUp = async () => {
        const json = JSON.stringify(user)
        const headers = {headers: {"Content-Type": 'application/json'}}
        try {
            const response = await axios.post(url + '/user/register', json, headers)
            console.log(response.data.id)
            setUserId(response.data.id)
            const dataForToken = JSON.stringify({user_id: response.data.id})
            const userToken = await axios.post(url + '/user/createtoken', dataForToken, headers)
            console.log(response.data)
            await sendMail(response.data.email, userToken.data)
            setUser({id: "", firstname: "", familyname: "", email: '', password: ''})
        } catch(error) {
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
        const headers = {headers: {"Content-Type": 'application/json'}}
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