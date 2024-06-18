

import express, { Request, Response } from "express"
import { login, logout, signup } from "../controllers/authController";

const router = express.Router();

router.post("/login", login)

router.post("/signup", signup)

router.post("/logout", logout)


export default router;