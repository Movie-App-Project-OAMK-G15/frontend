import dotenv from 'dotenv';
import { auth } from '../helpers/auth.js';
import { Router } from "express"
import { sendMail } from '../helpers/mailSender.js';
import { postRegistration, postLogin, verifyEmailByCode, creatTokenForSignUp, deleteAccount, addFavorite, getFavorites, updateUserBio, getUserBio, changeProfilePic, getProfilePicture, getAllUsersController } from "../controllers/UserController.js";
import multer from 'multer';

dotenv.config();
const userRouter = Router()

const upload = multer({ dest: 'uploads/' });

// Endpoint to verify email using a verification code
userRouter.post('/verifyemail', verifyEmailByCode);
// Requires: Verification code in the request body
// Middleware: None
// Returns: Confirmation of email verification or an error if the code is invalid

// Endpoint for user registration
userRouter.post('/register', postRegistration, creatTokenForSignUp, sendMail);
// Requires: User details in the request body (e.g., email, password, etc.)
// Middleware: postRegistration (handles registration logic), creatTokenForSignUp (generates a token for email verification), sendMail (sends verification email)
// Returns: Confirmation of successful registration and email sent

// Endpoint for user login
userRouter.post('/login', postLogin);
// Requires: User email and password in the request body
// Middleware: None
// Returns: Authentication token and user details upon successful login

// Endpoint to delete a user's account
userRouter.post('/delete', auth, deleteAccount);
// Requires: User authentication (auth middleware) and user details in the request body
// Middleware: auth (ensures the user is authenticated)
// Returns: Confirmation of account deletion or an error if the user could not be deleted

// Endpoint to add a favorite movie for a user
userRouter.post('/addfavorite', addFavorite);
// Requires: Movie details and user information in the request body
// Middleware: None
// Returns: Confirmation of movie addition to favorites or an error if it failed

// Endpoint to get all favorite movies for a user
userRouter.get('/favorites/:userId', getFavorites);
// Requires: userId as a URL parameter
// Middleware: None
// Returns: A list of the user's favorite movies

// Endpoint to update a user's bio
userRouter.put('/bio/:userId', updateUserBio);
// Requires: userId as a URL parameter and bio content in the request body
// Middleware: None
// Returns: Confirmation of bio update or an error if the update failed

// Endpoint to get a user's bio
userRouter.get('/bio/:userId', getUserBio);
// Requires: userId as a URL parameter
// Middleware: None
// Returns: The user's bio or an error if it could not be retrieved

// Endpoint to change a user's profile picture
userRouter.post('/profile-pic/:userId', upload.single('profilePic'), changeProfilePic);
// Requires: userId as a URL parameter and a file upload (profilePic) in the request
// Middleware: upload.single('profilePic') (handles file upload)
// Returns: Confirmation of profile picture update or an error if it failed

// Endpoint to get a user's profile picture
userRouter.get('/getpic/:userId', getProfilePicture);
// Requires: userId as a URL parameter
// Middleware: None
// Returns: The user's profile picture URL or an error if it could not be retrieved

// Endpoint to get a list of all users
userRouter.get('/all', getAllUsersController);
// Requires: Nothing
// Middleware: None
// Returns: A list of all registered users in the system



export default userRouter