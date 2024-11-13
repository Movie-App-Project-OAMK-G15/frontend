import { Link, useNavigate } from 'react-router-dom' 
import { useState } from 'react'
import ErrorNotification from '../components/ErrorNotification.jsx'
import Navbar from '../components/Navbar.jsx'
import { useUser } from '../context/useUser'
import '../styles/Authentication.css'

export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
})

export default function Authentication({authenticationMode}) {
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [type, setType] = useState("")
    const {user, setUser, signUp, signIn} = useUser()
    const navigate = useNavigate()

    const handleSubmit = async(event) => {
        event.preventDefault()
        try {
            if(authenticationMode === AuthenticationMode.Register){
                await signUp()
                navigate('/signin')
                setNotificationMessage('New account has been created successfully!')
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 3000)
            }else{
                await signIn() 
                navigate('/account')
            }
        } catch (error) {
            const message = error.response && error.response.data ? error.response.data.error : error
            setNotificationMessage(message)
            setType('error')
            setTimeout(() => {
                setNotificationMessage(null)
                setType('')
              }, 3000)
        }
    }
    return (
        <>
        <Navbar/>
        <div className='auth'>
            <ErrorNotification message={notificationMessage} type={type}/>
            <h3>{authenticationMode === AuthenticationMode.Login ? 'Sign in' : 'Sign up'}</h3>
            <form onSubmit={handleSubmit}>
                    {authenticationMode === AuthenticationMode.Register ? 
                        <div>
                        <label>Firstname</label>
                        <input id='fname_field' type='text' value={user.firstname} onChange={event => setUser({...user, firstname: event.target.value})}/>
                        </div>
                    : ""}
                    {authenticationMode === AuthenticationMode.Register ? 
                        <div>
                        <label>Surename</label>
                        <input id='sname_field' type='text' value={user.familyname} onChange={event => setUser({...user, familyname: event.target.value})}/>
                        </div>
                    : ""}
                <div>
                    <label>Email</label>
                    <input id='email_field' type='email' value={user.email} onChange={event => setUser({...user, email: event.target.value})}/>
                </div>
                <div>
                    <label>Password</label>
                    <input id='password_field' type='password' value={user.password} onChange={event => setUser({...user, password: event.target.value})}/>
                </div>
                <div>
                    <button id={authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}>{authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}</button>
                </div>
                <div id='switch'>
                    <Link to={authenticationMode === AuthenticationMode.Login ? '/signup' : '/signin'}>
                        {authenticationMode === AuthenticationMode.Login ? 'No account? Sign up' : 'Already signed up? Sign in'}
                    </Link>
                </div>
            </form>
        </div>
        </>
    )
}
