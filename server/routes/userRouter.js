import dotenv from 'dotenv';
import { auth } from '../helpers/auth.js';
import { Router } from "express"
import { sendMail } from '../helpers/mailSender.js';
import { postRegistration, postLogin, verifyEmailByCode, creatTokenForSignUp, deleteAccount, addFavorite, getFavorites, updateUserBio, getUserBio, changeProfilePic, getProfilePicture, getAllUsersController } from "../controllers/UserController.js";
import multer from 'multer';

dotenv.config();
const userRouter = Router()

const upload = multer({ dest: 'uploads/' });

userRouter.post('/verifyemail', verifyEmailByCode)

userRouter.post('/register', postRegistration, creatTokenForSignUp, sendMail)

userRouter.post('/login', postLogin)

userRouter.post('/delete', auth, deleteAccount)

//add favorite movie
userRouter.post('/addfavorite', addFavorite)

//get favorite movies for a user
userRouter.get('/favorites/:userId', getFavorites)

//add bio
userRouter.put('/bio/:userId', updateUserBio)

//get bio
userRouter.get('/bio/:userId', getUserBio)

userRouter.post('/profile-pic/:userId', upload.single('profilePic') ,changeProfilePic)

userRouter.get('/getpic/:userId', getProfilePicture)

userRouter.get("/all", getAllUsersController);


export default userRouter