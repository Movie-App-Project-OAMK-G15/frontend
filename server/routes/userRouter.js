import dotenv from 'dotenv';
import { Router } from "express"
import { postRegistration, postLogin, deleteAccount, addFavorite, getFavorites, updateUserBio, getUserBio, changeProfilePic, getProfilePicture, getAllUsersController } from "../controllers/UserController.js";
import multer from 'multer';

dotenv.config();
const userRouter = Router()

const upload = multer({ dest: 'uploads/' });

userRouter.post('/register', postRegistration)

userRouter.post('/login', postLogin)

userRouter.post('/delete', deleteAccount)

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