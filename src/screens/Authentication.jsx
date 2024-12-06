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
    Register: 'Register',
    Confirm: 'Confirm'
})

export default function Authentication({authenticationMode}) {
    //custom notification/error message state
    const [notificationMessage, setNotificationMessage] = useState(null)
    //custom notification/error type
    const [type, setType] = useState("")
    const [loading, setLoading] = useState(false);
    //import from context
    const {user, setUser, signUp, signIn, confirmEmail} = useUser()
    //navigation
    const navigate = useNavigate()
    //email code
    const [code, setCode] = useState('')

    const validateSignupInput = (email, password) => {
        // Email validation: More than 3 chars before @, 3 or more chars after @, and a domain name
        const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/;
      
        // Password validation: At least 8 characters, one uppercase, one lowercase, and one number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      
        // Check email
        if (!emailRegex.test(email)) {
          return { isValid: false, message: "Invalid email format." };
        }
      
        // Check password
        if (!passwordRegex.test(password)) {
          return {
            isValid: false,
            message:
              "Password must be at least 8 characters long, contain one uppercase letter, and at least one number.",
          };
        }
      
        // If both are valid
        return { isValid: true, message: "Input is valid." };
      };


    //conditional submit for handler for both login and sign up
    const handleSubmit = async(event) => {
        event.preventDefault()

        const res = validateSignupInput(user.email, user.password)

        if(res.isValid){
            try {
                if(authenticationMode === AuthenticationMode.Register){//register(sign up) option
                    if(user.firstname.length == 0 || user.familyname.length == 0){
                        setNotificationMessage('firstname or family name are too short')//custom error notification
                            setType('error')//notification type
                            setTimeout(() => {
                                setNotificationMessage(null)
                                setType('')
                              }, 3000)
                            return
                    }
                    setLoading(true)
                    await signUp() //calling context function 
                    setLoading(false)
                    navigate('/confirm') //if no errors -> navigating to confirm page
                }else{//login option
                    setLoading(true)
                    await signIn() //calling context function 
                    setLoading(false)
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
        }else if(res.message == "Invalid email format."){
            setNotificationMessage(res.message)//custom error notification
                setType('error')//notification type
                setTimeout(() => {
                    setNotificationMessage(null)
                    setType('')
                  }, 3000)
        }else{
            setNotificationMessage(res.message)//custom error notification
                setType('error')//notification type
                setTimeout(() => {
                    setNotificationMessage(null)
                    setType('')
                  }, 5000)
        }
    }

    const handleEmailCode = async() => {
        try {
            setLoading(true)
            await confirmEmail(code)
            setLoading(false)
            navigate('/signin')
            setNotificationMessage('New account has been created successfully!') //custom message
            //timeout for custom message
            setTimeout(() => {
                    setNotificationMessage(null)
            }, 3000)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
        <Navbar/>
        <div className='auth'>
            <ErrorNotification message={notificationMessage} type={type}/>
            {loading && <div className="alert alert-info text-center">Please, wait a bit...</div>}
            <h3>{authenticationMode === AuthenticationMode.Login ? 'Sign in' : authenticationMode === AuthenticationMode.Confirm ? 'Confirm your email' : 'Sign up'}</h3>
            {authenticationMode === AuthenticationMode.Register || authenticationMode === AuthenticationMode.Login ? 
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
                :
                <div>
                    <p>To check is your email real, we have sent a confirmation code to your email address.</p>
                    <label>Enter code from email:</label>
                    <input 
                        id='code_field' 
                        type='text' 
                        value={code} 
                        onChange={event => setCode(event.target.value)} 
                    />
                    <button onClick={handleEmailCode}>Send code</button>
                </div>
            }
            
        </div>
        </>
    )
}
