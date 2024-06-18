import { Request, Response } from "express";
import Conversation from "../db/models/conversationModel";
import Message from "../db/models/messageModel";


export const sendMessage = async (req : Request,res : Response) => {
    console.log("message sent", req.params.id);
    try {
        const {message} = req.body;
        const {id : receiverId} = req.params;
        // @ts-ignore 
        const senderId = req.user._id
        
        let conversation = await Conversation.findOne({
            participants : { $all : [senderId, receiverId]}
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants : [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if(newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])
 
        res.status(201).json(
            {message : newMessage,
             success : true
            })

    } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during message",  message); 
        res.status(500).json(
            {error : "Internal server error",
             success : false
            })
    }
}

export const getMessages = async (req : Request, res : Response) => {
    try {

        const {id : userToChatId} = req.params;
        // @ts-ignore
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants : { $all : [senderId, userToChatId]}
        }).populate("messages")

        if (!conversation) return res.status(200).json({
            message : [],
            success : true
        })
        res.status(200).json(
            {message : conversation?.messages,
             success : true
            });

    } catch (error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error during get message",  message); 
        res.status(500).json(
            {error : "Internal server error",
             success : false
            })
    }
}
