import { UserController } from "../controllers/user.controller.js";

import express from "express";
const router = express.Router();

router.post("/newUser", UserController.newUser);
router.post('/logIn',UserController.logUserIn)

export default router;
