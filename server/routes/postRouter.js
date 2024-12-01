import dotenv from 'dotenv';
import multer from 'multer';
import { Router } from "express"
import { auth } from '../helpers/auth.js';
import { postGroupPost, removePost } from '../controllers/PostController.js';
dotenv.config();
const upload = multer({ dest: 'uploads/' });
const postRouter = Router()

postRouter.post('/newpost', auth, upload.single('photo'), postGroupPost)

postRouter.post('/deletepost', auth, removePost)

export default postRouter