import { useUser } from "../context/useUser"
import Navbar from "../components/Navbar"

export default function UserAccount(){
    const { user, logOut, deleteAccount } = useUser()

    return (
        <>
            <Navbar/>
            <div>{user.firstname}</div>
            <div>{user.familyname}</div>
            <div>{user.email}</div>
            <button onClick={deleteAccount}>Delete account</button>
            <button onClick={logOut}>Log Out</button>
        </>
    )
}