import { useState } from 'react'
import { UserContext } from './UserContext'
import axios from 'axios'

const url = import.meta.env.VITE_API_URL

export default function UserProvider({children}) {

    const userfromSessionStorage = sessionStorage.getItem('user')
    const [user, setUser] = useState(userfromSessionStorage ? JSON.parse(userfromSessionStorage) : {id: "", firstname: "", familyname: "", email: '', password: ''})

    const getToken = () => {
        const token = JSON.parse(sessionStorage.getItem('user'))
        if(token.token){
            return token.token
        }
        return null
    }

    const signUp = async () => {
        const json = JSON.stringify(user)
        const headers = {headers: {"Content-Type": 'application/json'}}
        try {
            await axios.post(url + '/user/register', json, headers)
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

        return (
            <UserContext.Provider value={{user, setUser, signUp, signIn, logOut, getToken, deleteAccount}}>
                { children }
            </UserContext.Provider>
        )
}