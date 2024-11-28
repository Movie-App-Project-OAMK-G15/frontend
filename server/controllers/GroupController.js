import { postGroup, getAllGroups, getAllSubsForGroup, removeSubscriber, postNewRequest, getAllRequests, getRequestsByGroupId, getGroupById, approveRequest, getAllFollowers, removeRequest } from "../models/Group.js";
import { ApiError } from "../helpers/errorClass.js";
import { uploadToImgBB } from "../helpers/uploadPhoto.js";
import multer from "multer";

// Ensure the uploads folder exists and handle the file path
async function postNewGroup(req, res, next) {
    try {
        if(!req.body.adm_mail || req.body.adm_mail.length === 0) return next(new ApiError('Invalid admin email for group', 400));
        if(!req.body.g_name || req.body.g_name.length === 0) return next(new ApiError('Invalid group name for group', 400));
        if(!req.body.description || req.body.description.length === 0) return next(new ApiError('Invalid description for group', 400));

        const { file } = req; // Access the uploaded file
        if (!file) {
            console.log(req.file)
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        // Use the reusable function to upload the photo to ImgBB
        const imageUrl = await uploadToImgBB(file.path);

        const response = await postGroup(req.body.adm_mail, req.body.g_name, req.body.description, imageUrl);  
        if (response.rowCount > 0) {
            return res.status(200).json({state: `group: ${req.body.g_name} has been created`});
        } else {
            return next(new ApiError('Group creation failed', 400));
        }
    } catch (error) {
        console.error("Error in postNewGroup: ", error);
        return next(error);
    }
}   

async function getGroups(req, res, next){
    try {
        const response = await getAllGroups()
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in getGroups: ", error);
        return next(error);
    }
}

async function getSubs(req, res, next) {
    try {
        if(!req.body.group_id || req.body.group_id.length === 0) return next(new ApiError('Invalid groupId for group', 400));
        const response = await getAllSubsForGroup(req.body.group_id)
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in getSubs: ", error);
        return next(error);
    }
}

async function postRequest(req, res, next) {
    try {
        if(!req.body.group_id || req.body.group_id.length === 0) return next(new ApiError('Invalid groupId for group', 400));
        if(!req.body.user_email || req.body.user_email.length === 0) return next(new ApiError('Invalid user_eamil for group', 400));

        const response = await postNewRequest(req.body.group_id, req.body.user_email)
        if(response.rowCount > 0){
            return res.status(200).json({state: `request: ${req.body.user_email} sent a request to join a group`});
        }
    } catch (error) {
        console.error("Error in postRequest: ", error);
        return next(error);
    }
}

async function getRequests(req, res, next) {
    try {
        const response = await getAllRequests()
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in getRequests: ", error);
        return next(error);
    }
}

async function getFollowersAll(req, res, next) {
    try {
        const response = await getAllFollowers()
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in getRequests: ", error);
        return next(error);
    }
}

async function getGroupUsingId(req, res, next) {
    try {
        const response = await getGroupById(req.body.group_id)
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in getGroupUsingId: ", error);
        return next(error);
    }
}

async function getRequestsByGId(req, res, next) {
    try {
        if(!req.body.group_id || req.body.group_id.length === 0) return next(new ApiError('Invalid groupId for group', 400));
        const response = await getRequestsByGroupId(req.body.group_id)
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in getRequestsByGId: ", error);
        return next(error);
    }
}

async function approveRequestById(req, res, next) {
    try {
        const response = await approveRequest(req.body.req_id)
        if(response.rowCount > 0){
            return res.status(200).json(response.rows);
        }
    } catch (error) {
        console.error("Error in approveRequestById: ", error);
        return next(error);
    }
}

async function removeSubscriberByMail(req, res, next) {
    try {
        const response = await removeSubscriber(req.body.email)
        if(response.rowCount > 0){
            return res.status(200).json({status: `user ${req.body.email} was deleted from the group`});
        }
    } catch (error) {
        console.error("Error in approveRequestById: ", error);
        return next(error);
    }
}

async function removeRequestById(req, res, next) {
    try {
        const response = await removeRequest(req.body.req_id)
        if(response.rowCount > 0){
            return res.status(200).json({status: `req number ${req.body.req_id} was deleted from the requests`});
        }
    } catch (error) {
        console.error("Error in removeRequestById: ", error);
        return next(error);
    }
}

export { postNewGroup, removeRequestById, getGroups, getSubs, postRequest, getRequests, getRequestsByGId, getGroupUsingId, approveRequestById, getFollowersAll, removeSubscriberByMail };
