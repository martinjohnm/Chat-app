import { Request, Response } from "express";
import User from "../db/models/userModel";



export const getUserForSideBar = async (req : Request,res : Response) => {
    try {

        // @ts-ignore
        const loggedInUser = req.user._id

        if (!loggedInUser) {
            res.json({
                error : "You are not logged in",
                success : false
            })
   
        }

        const filteredUser = await User.find({_id:{$ne : loggedInUser}}).select("-password")

        if (!filteredUser) {
            res.json({
                error : "something went wrong",
                success : false
            })
           
        }
        

        res.status(200).json(
            {data : filteredUser,
             success : true
            })

    } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during get user",  message); 
        res.status(500).json(
            {error : "Internal server error",
             success : false
            })
    }
}

export const getUserDetails = async (req : Request,res : Response) => {
    try {
        // @ts-ignore
        const userId = req.user._id;
      
        if (!userId) {
            return res.json({
                error : "You are not logged in",
                success : false
            })
        }
        const currentUser = await User.find({_id : userId}).select("-password")
        console.log(currentUser);
        
        return res.json({
            user : currentUser,
            error: false,
            success : true
        })
    } catch(error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during get user",  message); 
        res.status(500).json({error : "Internal server error"})
        return res.json({
            error : "SOmething went wrong",
            success : false
        })
    }
}