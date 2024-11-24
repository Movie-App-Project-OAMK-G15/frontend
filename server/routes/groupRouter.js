import dotenv from 'dotenv';
import { Router } from "express"
import { auth } from '../helpers/auth.js';
import { postNewGroup, getGroups, getSubs, postRequest, getRequests } from "../controllers/GroupController.js";

dotenv.config();
const groupRouter = Router()

groupRouter.post('/newgroup', auth, postNewGroup)

groupRouter.post('/getfollowers', auth, getSubs)

groupRouter.post('/request', auth, postRequest)

groupRouter.get('/allrequests', getRequests)

groupRouter.get('/getgroups', getGroups)

export default groupRouter