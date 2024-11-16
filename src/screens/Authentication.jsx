import { Link, useNavigate } from 'react-router-dom' 
import { useState } from 'react'
import ErrorNotification from '../components/ErrorNotification.jsx'
import Navbar from '../components/Navbar.jsx'
import { useUser } from '../context/useUser'
import '../styles/Authentication.css'

//enum implementation for js object for setting a authentication mode
//for further conditional rendering
export const AuthenticationMode = Object.freeze({
    Login: 'Login',
    Register: 'Register'
})

export default function Authentication({authenticationMode}) {
    //custom notification/error message state
    const [notificationMessage, setNotificationMessage] = useState(null)
    //custom notification/error type
    const [type, setType] = useState("")
    //import from context
    const {user, setUser, signUp, signIn} = useUser()
    //navigation
    const navigate = useNavigate()


    //conditional submit for handler for both login and sign up
    const handleSubmit = async(event) => {
        event.preventDefault()
        try {
            if(authenticationMode === AuthenticationMode.Register){//register(sign up) option
                await signUp() //calling context function 
                navigate('/signin') //if no errors -> navigating to sign in page
                setNotificationMessage('New account has been created successfully!') //custom message
                //timeout for custom message
                setTimeout(() => {
                    setNotificationMessage(null)
                }, 3000)
            }else{//login option
                await signIn() //calling context function 
                navigate('/account') //if no errors -> navigating to user account page
            }
        } catch (error) {
            const message = error.response && error.response.data ? error.response.data.error : error
            setNotificationMessage(message)//custom error notification
            setType('error')//notification type
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
                        <label>Surname</label>
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
