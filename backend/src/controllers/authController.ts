import { Request, Response } from "express";
import User from "../db/models/userModel";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken";



export const signup = async (req : Request,res : Response) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json(
                {error : "Passwords dont match",
                 success : false}
                )
        }

        const user = await User.findOne({username})

        if (user){
            return res.status(400).json(
                {error : "Username already exists",
                 success : false
                })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender
        })

        if (newUser) {
            generateTokenAndSetCookie(String(newUser._id), res);
            await newUser.save();
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                username : newUser.username,
                success : true
        })
        } else {
            res.status(400).json(
                {error : "Invalid user data",
                 success : false
                }
            )
        }
      
    } catch(error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during signup",  message); 
        res.status(500).json(
            {error : "Internal server error",
             success : false
            }
        )
    }
}

export const login = async (req : Request,res : Response) => {
    try {

        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password , user?.password || "")

        if(!user || !isPasswordCorrect) {
            return res.status(400).json(
            {error : "Invalid credentials",
             success : false
            })
        }

        generateTokenAndSetCookie(String(user._id), res);

        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            username : user.username,
            success : true
        })

    } catch(error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during login",  message); 
        res.status(500).json(
            {error : "Internal server error",
             success : false
            })
    }
}

export const logout = (req : Request,res : Response) => {
    try {

        res.clearCookie("jwt")

        res.status(200).json(
            {message : "Logged out successfully",
             success : true,
            })
        

    } catch(error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during logout",  message); 
        res.status(500).json({error : "Internal server error", success : false})
    }
}



