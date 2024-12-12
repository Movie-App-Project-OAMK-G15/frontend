import dotenv from 'dotenv';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
import { Router } from "express"
import { auth, checkIsAdmin } from '../helpers/auth.js';
import { postNewGroup, editGroup, deleteGroupById, getUsersGroupsByEmail, getUsersOwnGroupsByEmail, unfollowGroupByEmail, removeRequestById, getPostsByGId, getGroups, getSubs, postRequest, getRequests, getRequestsByGId, getGroupUsingId, approveRequestById, getFollowersAll, removeSubscriberByMail } from "../controllers/GroupController.js"; //imposrting controllers

dotenv.config();
const groupRouter = Router()

// Endpoint to fetch all groups the user is a member of by email
groupRouter.post('/getusergroups', auth, getUsersGroupsByEmail); 
// Requires: user's email in the body
// Middleware: auth (user must be authenticated)
// Returns: List of groups the user has joined

// Endpoint to fetch groups created by the user
groupRouter.post('/getuserowngroups', auth, getUsersOwnGroupsByEmail);
// Requires: user's email in the body
// Middleware: auth (user must be authenticated)
// Returns: List of groups created/owned by the user

// Endpoint to edit group information
groupRouter.post('/editinfo', auth, upload.single('photo'), editGroup);
// Requires: group_id, group_name, description, and optionally a new photo
// Middleware: auth (user must be authenticated), upload (handles photo upload)
// Returns: Confirmation message with the number of rows updated

// Endpoint to unfollow a group
groupRouter.post('/unfollow', auth, unfollowGroupByEmail);
// Requires: group_id and user's email in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation of successful unfollow or error if user isn't subscribed

// Endpoint to delete a group by its ID
groupRouter.post('/deletegroup', auth, deleteGroupById);
// Requires: group_id in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation that the group was deleted or an error

// Endpoint to get posts for a specific group by ID
groupRouter.post('/getpostsfrogroup', auth, getPostsByGId);
// Requires: group_id in the body
// Middleware: auth (user must be authenticated)
// Returns: List of posts associated with the specified group

// Endpoint to create a new group
groupRouter.post('/newgroup', auth, upload.single('photo'), postNewGroup);
// Requires: adm_mail (admin email), g_name (group name), description, and a photo
// Middleware: auth (user must be authenticated), upload (handles photo upload)
// Returns: Confirmation message that the group was created

// Endpoint to get all subscribers for a group
groupRouter.post('/getfollowers', auth, getSubs);
// Requires: group_id in the body
// Middleware: auth (user must be authenticated)
// Returns: List of all users subscribed to the specified group

// Endpoint to approve a user's request to join a group
groupRouter.post('/approverequest', auth, approveRequestById);
// Requires: req_id (request ID) in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation that the request was approved

// Endpoint to create a join request for a group
groupRouter.post('/request', auth, postRequest);
// Requires: group_id and user_email in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation that the join request was sent

// Endpoint to get group details by group ID
groupRouter.post('/groupbyid', auth, getGroupUsingId);
// Requires: group_id in the body
// Middleware: auth (user must be authenticated)
// Returns: Details of the specified group

// Endpoint to get all requests (admin-level access likely required)
groupRouter.get('/allrequests', getRequests);
// Middleware: none (available to any user)
// Returns: List of all requests across all groups

// Endpoint to fetch requests for a specific group by ID
groupRouter.post('/requestsforgroup', auth, getRequestsByGId);
// Requires: group_id in the body
// Middleware: auth (user must be authenticated)
// Returns: List of requests for the specified group

// Endpoint to fetch all groups
groupRouter.get('/getgroups', getGroups);
// Middleware: none (available to any user)
// Returns: List of all available groups

// Endpoint to fetch all followers of all groups (admin-level access likely required)
groupRouter.get('/getfollowersall', getFollowersAll);
// Middleware: none (available to any user)
// Returns: List of all followers across all groups

// Endpoint to reject a request to join a group
groupRouter.post('/rejectrequest', auth, removeRequestById);
// Requires: req_id (request ID) in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation that the request was deleted

// Endpoint to remove a user from a group by email
groupRouter.post('/removeuser', auth, removeSubscriberByMail);
// Requires: email of the user to be removed in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation that the user was removed from the group


export default groupRouter