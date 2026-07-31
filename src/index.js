// require("dotenv").config({path : './env'});
import dotenv from "dotenv";
dotenv.config({path:'./.env'});
import connectDB from "./db/index.js";
import {app} from "./app.js";



connectDB()
.then(() => {
    const server = app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is runnig on port ${process.env.PORT || 8000}`);
    });

    server.on("error",(error)=>{
    console.log("Error during listening to the server",error);
});

})    


.catch((error)=>{
    console.log("MongoDB connecton failed",error);
})






 




/*
import mongoose from "mongoose";
import {DB_NAME} from "./constant.js"
import express from "express";
( async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.error("Error during connecting to database",error)
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listeing on port ${process.env.PORT}`)
        })
    }catch (error){
        console.log("Error",error)
        throw error
    } 
})()

*/