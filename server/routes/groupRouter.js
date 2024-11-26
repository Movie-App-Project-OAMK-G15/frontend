import dotenv from 'dotenv';
import { Router } from "express"
import { auth } from '../helpers/auth.js';
import { postNewGroup, getGroups, getSubs, postRequest, getRequests, getRequestsByGId, getGroupUsingId, approveRequestById } from "../controllers/GroupController.js";

dotenv.config();
const groupRouter = Router()

groupRouter.post('/newgroup', auth, postNewGroup)

groupRouter.post('/getfollowers', auth, getSubs)

groupRouter.post('/approverequest', auth, approveRequestById)

groupRouter.post('/request', auth, postRequest)

groupRouter.post('/groupbyid', auth, getGroupUsingId)

groupRouter.get('/allrequests', getRequests)

groupRouter.post('/requestsforgroup', auth, getRequestsByGId)

groupRouter.get('/getgroups', getGroups)

export default groupRouter