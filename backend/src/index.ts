

import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"


import authRoutes from "./routes/auth"
import messageRoutes from "./routes/message"
import userRoutes from "./routes/user"
import cors from "cors"
import connectToMongoDb from "./db"

const app = express();


dotenv.config();

const front_end_url = process.env.FRONTEND_URL || "";

const PORT = process.env.PORT || 3000;

// app.get("/", (req: Request,res: Response) => {
//     res.send("working")
// })
app.use(express())
app.use(express.json()) // to parse incoming requests with JSON Payloads( from req.body )
app.use(cors({
    origin : front_end_url,
    credentials : true,
    
}))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
    
    connectToMongoDb()
    console.log(`App running on ${PORT}`);
    
})