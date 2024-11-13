import { useUser } from "../context/useUser"

export default function UserAccount(){
    const { user } = useUser()
    return (
        <>
            <div>{user.firstname}</div>
        </>
    )
}