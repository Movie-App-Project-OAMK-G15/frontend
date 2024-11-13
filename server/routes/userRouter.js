import dotenv from 'dotenv';
import { Router } from "express"
import { postRegistration, postLogin, deleteAccount } from "../controllers/UserController.js";

dotenv.config();
const userRouter = Router()

userRouter.post('/register', postRegistration)

userRouter.post('/login', postLogin)

userRouter.post('/delete', deleteAccount)

export default userRouter