import { postGroup, getAllGroups, getUsersGroups, getUsersOwnGroups, editGroupInfo, getAllSubsForGroup, deleteGroup, unfollowGroup, removeSubscriber, getPostsGyGroupId, postNewRequest, getAllRequests, getRequestsByGroupId, getGroupById, approveRequest, getAllFollowers, removeRequest } from "../models/Group.js";
import { ApiError } from "../helpers/errorClass.js";
import { uploadToImgBB } from "../helpers/uploadPhoto.js";

// Handles the creation of a new group, including file upload and validation.
async function postNewGroup(req, res, next) {
    try {
        if (!req.body.adm_mail || req.body.adm_mail.length === 0) 
            return next(new ApiError('Invalid admin email for group', 400));
        if (!req.body.g_name || req.body.g_name.length === 0) 
            return next(new ApiError('Invalid group name for group', 400));
        if (!req.body.description || req.body.description.length === 0) 
            return next(new ApiError('Invalid description for group', 400));

        const { file } = req; // Access the uploaded file.
        if (!file) {
            console.log(req.file);
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        // Upload the image and get its URL.
        const imageUrl = await uploadToImgBB(file.path);

        const response = await postGroup(req.body.adm_mail, req.body.g_name, req.body.description, imageUrl);  
        if (response.rowCount > 0) {
            return res.status(200).json({ state: `group: ${req.body.g_name} has been created` });
        } else {
            return next(new ApiError('Group creation failed', 400));
        }
    } catch (error) {
        console.error("Error in postNewGroup: ", error);
        return next(error);
    }
}   

// Fetches all existing groups.
async function getGroups(req, res, next) {
    try {
        const response = await getAllGroups();
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getGroups: ", error);
        return next(error);
    }
}

// Fetches groups a user is a part of by their email.
async function getUsersGroupsByEmail(req, res, next) {
    try {
        const response = await getUsersGroups(req.body.user_email);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getUsersGroupsByEmail: ", error);
        return next(error);
    }
}

// Fetches groups created by a user based on their email.
async function getUsersOwnGroupsByEmail(req, res, next) {
    try {
        const response = await getUsersOwnGroups(req.body.user_email);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getUsersOwnGroupsByEmail: ", error);
        return next(error);
    }
}

// Edits group information, including the option to update its photo.
async function editGroup(req, res, next) {
    try {
        if (!req.body.group_name || req.body.group_name.length === 0) 
            return next(new ApiError('Invalid group name for group', 400));
        if (!req.body.description || req.body.description.length === 0) 
            return next(new ApiError('Invalid description for group', 400));
        if (!req.body.group_id) 
            return next(new ApiError('Invalid photo for group', 400));

        const { file } = req; // Access the uploaded file.
        if (!file) {
            const response = await editGroupInfo(req.body.group_name, req.body.description, req.body.photo, req.body.group_id);
            return res.status(200).json({ status: 'Group info edited', resp: response.rowCount });
        }
        const imageUrl = await uploadToImgBB(file.path);
        const response = await editGroupInfo(req.body.group_name, req.body.description, imageUrl, req.body.group_id);
        return res.status(200).json({ status: 'Group info edited', resp: response.rowCount });
    } catch (error) {
        console.error("Error in editGroup: ", error);
        return next(error);
    }
}

// Fetches all subscribers for a specific group.
async function getSubs(req, res, next) {
    try {
        if (!req.body.group_id || req.body.group_id.length === 0) 
            return next(new ApiError('Invalid groupId for group', 400));
        const response = await getAllSubsForGroup(req.body.group_id);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getSubs: ", error);
        return next(error);
    }
}

// Submits a request to join a group.
async function postRequest(req, res, next) {
    try {
        if (!req.body.group_id || req.body.group_id.length === 0) 
            return next(new ApiError('Invalid groupId for group', 400));
        if (!req.body.user_email || req.body.user_email.length === 0) 
            return next(new ApiError('Invalid user_email for group', 400));

        const response = await postNewRequest(req.body.group_id, req.body.user_email);
        if (response.rowCount > 0) {
            return res.status(200).json({ state: `request: ${req.body.user_email} sent a request to join a group` });
        }
    } catch (error) {
        console.error("Error in postRequest: ", error);
        return next(error);
    }
}

// Retrieves all join requests for all groups.
async function getRequests(req, res, next) {
    try {
        const response = await getAllRequests();
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getRequests: ", error);
        return next(error);
    }
}

// Retrieves all followers for all groups.
async function getFollowersAll(req, res, next) {
    try {
        const response = await getAllFollowers();
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getRequests: ", error);
        return next(error);
    }
}

// Fetches a specific group by its ID.
async function getGroupUsingId(req, res, next) {
    try {
        const response = await getGroupById(req.body.group_id);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getGroupUsingId: ", error);
        return next(error);
    }
}

// Fetches all requests for a specific group by its ID.
async function getRequestsByGId(req, res, next) {
    try {
        if (!req.body.group_id || req.body.group_id.length === 0) 
            return next(new ApiError('Invalid groupId for group', 400));
        const response = await getRequestsByGroupId(req.body.group_id);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getRequestsByGId: ", error);
        return next(error);
    }
}

// Approves a specific join request by its ID.
async function approveRequestById(req, res, next) {
    try {
        const response = await approveRequest(req.body.req_id);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in approveRequestById: ", error);
        return next(error);
    }
}

// Removes a subscriber from a group by their email.
async function removeSubscriberByMail(req, res, next) {
    try {
        const response = await removeSubscriber(req.body.email);
        if (response.rowCount > 0) {
            return res.status(200).json({ status: `user ${req.body.email} was deleted from the group` });
        }
    } catch (error) {
        console.error("Error in approveRequestById: ", error);
        return next(error);
    }
}

// Removes a specific join request by its ID.
async function removeRequestById(req, res, next) {
    try {
        const response = await removeRequest(req.body.req_id);
        if (response.rowCount > 0) {
            return res.status(200).json({ status: `req number ${req.body.req_id} was deleted from the requests` });
        }
    } catch (error) {
        console.error("Error in removeRequestById: ", error);
        return next(error);
    }
}

// Allows a user to unfollow a group by their email and group ID.
async function unfollowGroupByEmail(req, res, next) {
    try {
        const { group_id, user_email } = req.body;

        if (!group_id || !user_email) {
            return res.status(400).json({ error: "Group ID and user email are required." });
        }

        const { rows } = await unfollowGroup(group_id, user_email);

        if (rows && rows.length > 0) {
            return res.status(200).json({
                status: `Successfully unfollowed group.`,
            });
        } else {
            return res.status(404).json({ status: "No data was deleted. User may not be subscribed to the group." });
        }
    } catch (error) {
        console.error("Error in unfollowGroupByEmail: ", error);
        return next(error);
    }
}

// Retrieves all posts for a specific group by its ID.
async function getPostsByGId(req, res, next) {
    try {
        const response = await getPostsGyGroupId(req.body.group_id);
        return res.status(200).json(response.rows);
    } catch (error) {
        console.error("Error in getPostsByGId: ", error);
        return next(error);
    }
}

// Deletes a group based on its ID.
async function deleteGroupById(req, res, next) {
    try {
        const response = await deleteGroup(req.body.group_id);
        if (response.rowCount > 0) {
            return res.status(200).json({ status: `Group ${req.body.group_id} was deleted` });
        }
    } catch (error) {
        console.error("Error in deleteGroupById: ", error);
        return next(error);
    }
}

export {
    postNewGroup,
    getGroups,
    getUsersGroupsByEmail,
    getUsersOwnGroupsByEmail,
    editGroup,
    getSubs,
    postRequest,
    getRequests,
    getGroupUsingId,
    getRequestsByGId,
    approveRequestById,
    removeSubscriberByMail,
    unfollowGroupByEmail,
    getPostsByGId,
    deleteGroupById,
    getFollowersAll,
    removeRequestById
};
