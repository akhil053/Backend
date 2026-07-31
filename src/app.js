import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from "./routes/user.routes.js"  //import krte time naam kuch bhi rkh skte hai userRouter , router  , abc




// routes declaration
app.use("/api/v1/users",userRouter)


// http://localhost:8000/api/v1/users/register

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        err = new ApiError(400, "Invalid JSON in request body")
    }

    const statusCode = err.statusCode || err.status || 500

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || []
    })
})



export {app}



  
