import { useUser } from "../context/useUser"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom";

export default function UserAccount(){
    const { user, logOut, deleteAccount } = useUser()
    const navigate = useNavigate()

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
            <button onClick={()=> navigate('/account/creategroup')}>Create group</button>
        </>
    )
}