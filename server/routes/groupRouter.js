import dotenv from 'dotenv';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import { Router } from "express"
import { auth } from '../helpers/auth.js';
import { postNewGroup, editGroup, deleteGroupById, getUsersGroupsByEmail, getUsersOwnGroupsByEmail, unfollowGroupByEmail, removeRequestById, getPostsGyGroup, getGroups, getSubs, postRequest, getRequests, getRequestsByGId, getGroupUsingId, approveRequestById, getFollowersAll, removeSubscriberByMail } from "../controllers/GroupController.js";

dotenv.config();
const groupRouter = Router()

groupRouter.post('/getusergroups', auth, getUsersGroupsByEmail)

groupRouter.post('/getuserowngroups', auth, getUsersOwnGroupsByEmail)

groupRouter.post('/editinfo', auth, upload.single('photo'), editGroup)

groupRouter.post('/unfollow', auth, unfollowGroupByEmail)

groupRouter.post('/deletegroup', auth, deleteGroupById)

groupRouter.post('/getpostsfrogroup', auth, getPostsGyGroup)

groupRouter.post('/newgroup', auth, upload.single('photo'), postNewGroup)

groupRouter.post('/getfollowers', auth, getSubs)

groupRouter.post('/approverequest', auth, approveRequestById)

groupRouter.post('/request', auth, postRequest)

groupRouter.post('/groupbyid', auth, getGroupUsingId)

groupRouter.get('/allrequests', getRequests)

groupRouter.post('/requestsforgroup', auth, getRequestsByGId)

groupRouter.get('/getgroups', getGroups) // /group/getgroups

groupRouter.get('/getfollowersall', getFollowersAll)

groupRouter.post('/rejectrequest', auth, removeRequestById)

groupRouter.post('/removeuser', auth, removeSubscriberByMail)

export default groupRouter