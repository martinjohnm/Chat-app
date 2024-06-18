



import dotenv  from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const db_url = process.env.DATABASE_URL || ""

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(db_url)
        console.log("db connection successful");
    }catch(error) {
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("db connection failed",  message); 
    }
}

export default connectToMongoDb;