import express from "express";
const router = express.Router();
import { PostController } from "../controllers/post.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

router.post('/newPost', authenticateToken, PostController.createNewPost);
export default router;
