


import express from "express";
import protectRoute from "../middleware/protectRoute";
import { getUserDetails, getUserForSideBar } from "../controllers/userController";

const router = express.Router();

router.get("/", protectRoute ,getUserForSideBar)

router.get("/current-user",protectRoute, getUserDetails)


export default router;