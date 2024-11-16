import { useUser } from "../context/useUser"
import Navbar from "../components/Navbar"

export default function UserAccount(){
    const { user, logOut, deleteAccount } = useUser()
    //making sure user wants to delete an account
    function handleDelete(){
        if (confirm("Are you sure you want to delete this account?")) {
            deleteAccount();
        } else {
            console.log("User canceled the action.");
        }
    }
    return (
        <>
            <Navbar/>
            <div>{user.firstname}</div>
            <div>{user.familyname}</div>
            <div>{user.email}</div>
            <button onClick={handleDelete}>Delete account</button>
            <button onClick={logOut}>Log Out</button>
        </>
    )
}