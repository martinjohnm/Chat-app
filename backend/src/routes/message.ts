

import express, { Request, Response } from "express"
import { login, logout, signup } from "../controllers/authController";
import { getMessages, sendMessage } from "../controllers/messageController";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.post("/send/:id", protectRoute ,sendMessage)

router.get("/:id", protectRoute , getMessages)

export default router;