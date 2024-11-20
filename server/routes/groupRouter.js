import dotenv from 'dotenv';
import { Router } from "express"
import { auth } from '../helpers/auth.js';
import { postNewGroup, getGroups } from "../controllers/GroupController.js";

dotenv.config();
const groupRouter = Router()

groupRouter.post('/newgroup', auth, postNewGroup)

groupRouter.get('/getgroups', getGroups)

export default groupRouter