import dotenv from 'dotenv';
import { Router } from "express"
import { postRegistration, postLogin, deleteAccount, addFavorite, getFavorites, updateUserBio, getUserBio } from "../controllers/UserController.js";

dotenv.config();
const userRouter = Router()

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


export default userRouter