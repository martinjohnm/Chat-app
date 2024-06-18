

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/userModel";

const jwt_secret = process.env.JWT_SECRET || ""

interface JwtPayload {
    userId : String;
    iat : number
}

const protectRoute = async (req : Request,res : Response, next : NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json(
                { 
                    error : "Unauthorized - No Token Provided",
                    success : false
                })
        }

        const decoded = jwt.verify(token, jwt_secret) as JwtPayload

        if (!decoded) {
            return res.status(401).json({
                error : "Unauthorized - Invalid Token",
                success : false
            })
        }
      
        const user = await User.findById(decoded.userId).select("-password")

        if(!user) {
            return res.status(404).json(
                {
                    error : "User not found",
                    success : false
                })
        }
        // @ts-ignore
        req.user = user;
    
        next()

    } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        res.status(500).json(
            {
                error : "Internal server error",
                success : false
            })
    }
}

export default protectRoute