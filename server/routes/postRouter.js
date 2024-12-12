import dotenv from 'dotenv';
import multer from 'multer';
import { Router } from "express"
import { auth } from '../helpers/auth.js';
import { postGroupPost, removePost } from '../controllers/PostController.js';
dotenv.config();
const upload = multer({ dest: 'uploads/' });
const postRouter = Router()

// Endpoint to create a new post for a specific group
postRouter.post('/newpost', auth, upload.single('photo'), postGroupPost);
// Requires: group_id, content (post text), and optionally a photo in the body
// Middleware: auth (user must be authenticated), upload (handles photo upload)
// Returns: Confirmation message that the post was successfully created

// Endpoint to delete a specific post from the group page
postRouter.post('/deletepost', auth, removePost);
// Requires: post_id in the body
// Middleware: auth (user must be authenticated)
// Returns: Confirmation message that the post was successfully deleted or an error if the post could not be found


export default postRouter