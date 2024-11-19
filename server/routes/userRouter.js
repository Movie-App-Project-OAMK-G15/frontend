import dotenv from 'dotenv';
import { Router } from "express"
import { postRegistration, postLogin, deleteAccount, addFavorite, getFavorites } from "../controllers/UserController.js";

dotenv.config();
const userRouter = Router()

userRouter.post('/register', postRegistration)

userRouter.post('/login', postLogin)

userRouter.post('/delete', deleteAccount)

//add favorite movie
userRouter.post('/add-favorite', addFavorite)

//get favorite movies for a user
userRouter.get('/favorites/:userId', getFavorites)

export default userRouter