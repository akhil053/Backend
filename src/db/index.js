import mongoose from "mongoose";
import {DB_NAME } from "../constant.js";



const connectDB = async () => {
    try {
        // console.log("URI:", process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MOngoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1);
    }
}


export default connectDB;