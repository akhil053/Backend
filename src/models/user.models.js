import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"



const userSchema = new Schema(
    {
        userName : {
            type : String,
            required : true,
            unique : true,
            lowercase : true ,
            trim : true,
            index : true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true ,
            trim : true,
        },
        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true,
        },
        avatar : {
            type : String, // cloudinary url
            required : true,
        },
        coverImage:{
            type : String, // cloudinary
        },
        watchHistory : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video",
            }
        ],
        password : {
            type : String,
            required : [true , "Password is required"]
        },
        refreshToken:{
            type : String,
        }
    },
    {
        timestamps : true,
    }
)


userSchema.pre("save",async function () {
    if (!this.isModified("password")) return;   // agar if statement na likhu to jab bhi user kuch bhi save karega tab har baar password chnage hoga to ilsiye if statemnet use hua hai

    this.password = await bcrypt.hash(this.password , 10)
    
}) 
          
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToke = async function(){
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.userName,
            fullname :this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToke = async function(){
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)