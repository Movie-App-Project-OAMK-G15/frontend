import { postNewPost, deletePost } from "../models/Post.js";
import { ApiError } from "../helpers/errorClass.js";
import { uploadToImgBB } from "../helpers/uploadPhoto.js";
import { compressImage } from "../helpers/compressImg.js";

// Ensure the uploads folder exists and handle the file path
async function postGroupPost(req, res, next) {
    try {
        if(!req.body.user_email || req.body.user_email.length === 0) return next(new ApiError('Invalid admin email for group', 400));
        if(!req.body.group_id || req.body.group_id.length === 0) return next(new ApiError('Invalid group name for group', 400));
        if(!req.body.title || req.body.title.length === 0) return next(new ApiError('Invalid description for group', 400));

        const { file } = req; // Access the uploaded file
        if (!file) {
            const response = await postNewPost(req.body.user_email, req.body.group_id, req.body.title, req.body.content);  
            if (response.rowCount > 0) {
                return res.status(200).json({state: `post: ${req.body.title} has been created`});
            } else {
                return next(new ApiError('Group creation failed', 400));
            }        
        }
        
        //const compressedFilePath = await compressImage(file.path);
        // Use the reusable function to upload the photo to ImgBB
        const imageUrl = await uploadToImgBB(file.path);

        const response = await postNewPost(req.body.user_email, req.body.group_id, req.body.title, req.body.content, imageUrl);  
        if (response.rowCount > 0) {
            return res.status(200).json({state: `post: ${req.body.title} has been created`});
        } else {
            return next(new ApiError('Group creation failed', 400));
        }
    } catch (error) {
        console.error("Error in postNewGroup: ", error);
        return res.status(400).json({stateError: error});
    }
}   

async function removePost(req, res, next) {
    try {
        const response = await deletePost(req.body.post_id)
        if(response.rowCount > 0){
            return res.status(200).json({status: `post with id ${req.body.post_id} was deleted`});
        }
    } catch (error) {
        console.error("Error in removePost: ", error);
        return next(error);
    }
}

export {postGroupPost, removePost}