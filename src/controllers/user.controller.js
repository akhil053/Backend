import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.models.js" 
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async(req,res)=>{
    // get user deatils from frontend
    // validation - not empty
    // check if user already exists:check username and email
    // check for images, check for avatatr
    // upload them to cloudinary 
    // create user object - create entry in DB
    // remove password and refresh token field from response
    // check for user creation
    // return response


    const {fullName , email , username , password} = req.body;
    console.log("email :" , email);


    if( 
        [fullName , email , username , password].some((field)=>
        !field || field.trim()==="")
    ) 
    {
         throw new ApiError(400 , "All fields are mandatory")
    }


    const existedUser = await User.findOne({
        $or : [{ userName: username.toLowerCase() },{ email: email.toLowerCase() }] 
    })

    if(existedUser){
        throw new ApiError(409 , "User already exits")
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if( !avatarLocalPath){
        throw new ApiError(400 , "Avatar is needed");
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if(!avatar){
        throw new ApiError(400 , "Avatar is must");
    }

    const user = await User.create({
        fullName , 
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        userName: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "Something Went wrong while regestring the user")
    }


    return res.status(201).json(
        new ApiResponse(200 , createdUser , "user registered success")
    )




    // if(fullName === ""){
    //     throw new ApiError(400,"Full name is required")
    // }


   

})

export default registerUser
