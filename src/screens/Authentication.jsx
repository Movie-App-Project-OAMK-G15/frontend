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
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateSignupInput = (email, password) => {
        // Email validation: More than 3 chars before @, 3 or more chars after @, and a domain name
        const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{3,}\.[a-zA-Z]{2,}$/;
      
        // Password validation: At least 8 characters, one uppercase, one lowercase, and one number
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
      
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
                setLoading(false)
                setNotificationMessage(message)//custom error notification
                setType('error')//notification type
                setTimeout(() => {
                    setNotificationMessage(null)
                    setType('')
                  }, 3000)
                  
            }
        }else if(res.message == "Invalid email format."){
            setLoading(false)
            setNotificationMessage(res.message)//custom error notification
                setType('error')//notification type
                setTimeout(() => {
                    setNotificationMessage(null)
                    setType('')
                  }, 3000)
                  
        }else{
            setLoading(false)
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
            if(code.length > 6){
                setLoading(true)
                await confirmEmail(code)
                setLoading(false)
                navigate('/signin')
                setNotificationMessage('New account has been created successfully!') //custom message
                //timeout for custom message
                setTimeout(() => {
                        setNotificationMessage(null)
                }, 3000)
            }else{
                setNotificationMessage('Provided code is too short!')//custom error notification
                setType('error')//notification type
                setTimeout(() => {
                    setNotificationMessage(null)
                    setType('')
                  }, 5000)
            }
            
        } catch (error) {
            setLoading(false)
            setNotificationMessage(error)//custom error notification
                setType('error')//notification type
                setTimeout(() => {
                    setNotificationMessage(null)
                    setType('')
                  }, 5000)
                  
        }
    }

    return (
        <>
        <Navbar />
        <div className="auth container d-flex justify-content-center align-items-center vh-100">
      <div className="custom-card-auth p-4">
        <ErrorNotification message={notificationMessage} type={type} />
        {loading && <div className="alert alert-info text-center">Please, wait a bit...</div>}
        <h2 className="text-center mb-4">
          {authenticationMode === AuthenticationMode.Login
            ? 'Sign in'
            : authenticationMode === AuthenticationMode.Confirm
            ? 'Confirm your email'
            : 'Sign up'}
        </h2>
        {authenticationMode === AuthenticationMode.Register || authenticationMode === AuthenticationMode.Login ? (
          <form onSubmit={handleSubmit} className="row g-3">
            {authenticationMode === AuthenticationMode.Register && (
              <>
                <div className="col-md-6">
                  <label htmlFor="fname_field" className="form-label">
                    Firstname
                  </label>
                  <input
                    id="fname_field"
                    type="text"
                    className="form-control"
                    value={user.firstname}
                    onChange={(event) => setUser({ ...user, firstname: event.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="sname_field" className="form-label">
                    Surname
                  </label>
                  <input
                    id="sname_field"
                    type="text"
                    className="form-control"
                    value={user.familyname}
                    onChange={(event) => setUser({ ...user, familyname: event.target.value })}
                  />
                </div>
              </>
            )}
            <div className="col-12">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                id="email_field"
                type="email"
                className="form-control"
                value={user.email}
                onChange={(event) => setUser({ ...user, email: event.target.value })}
              />
            </div>
            <div className="col-12 position-relative password-container">
              <label htmlFor="password_field" className="form-label">
                Password
              </label>
              <input
                id="password_field"
                type={passwordVisible ? 'text' : 'password'}
                className="form-control"
                value={user.password}
                onChange={(event) => setUser({ ...user, password: event.target.value })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary position-absolute end-0 top-0 mt-2 me-2"
                onClick={togglePasswordVisibility}
                style={{
                    border: 'none',
                    background: 'transparent',       // Remove padding to make the button smaller
                    width: 'auto',          // Adjust the width to fit the icon
                    height: 'auto',         // Adjust the height to fit the icon
                    minWidth: '24px',       // Set a minimum width for the button to fit the icon comfortably
                    minHeight: '24px',      // Set a minimum height for the button
                    display: 'flex',        // Flex to center the icon
                }}
                >
                <i
                    className={`bi ${passwordVisible ? 'bi-eye' : 'bi-eye-slash'}`}
                    style={{ fontSize: '15px' }}  // Icon size can still be adjusted as needed
                />
                </button>
            </div>
            <div className="col-12 text-center">
              <button id={authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'} className="btn btn-primary w-100">
                {authenticationMode === AuthenticationMode.Login ? 'Login' : 'Submit'}
              </button>
            </div>
            <div id="switch" className="col-12 text-center">
              <Link to={authenticationMode === AuthenticationMode.Login ? '/signup' : '/signin'} className="link">
                {authenticationMode === AuthenticationMode.Login ? 'No account? Sign up' : 'Already signed up? Sign in'}
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p>To check if your email is real, we have sent a confirmation code to your email address.</p>
            <label htmlFor="code_field" className="form-label">
              Enter code from email:
            </label>
            <input
              id="code_field"
              type="text"
              className="form-control mb-3"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <button onClick={handleEmailCode} className="btn btn-primary w-100">
              Send code
            </button>
          </div>
        )}
      </div>
    </div>
        </>
    )
}
