const userModel=require('../models/user.model');
const blacklistModel=require('../models/blacklist.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


/**
 * @name registerUser
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUser(req,res){
    const {username,email,password}=req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"username,email and password is required"
        });
    }
    const isUserExist = await userModel.findOne({
        $or:[{username},{email}]
    });

    if(isUserExist ){
        return res.status(400).json({
            message:'user already exists with this username or email'
        })
    }

    const hash=await bcrypt.hash(password,10);

    const user=await userModel.create({username,email,password:hash});

    const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1d"});

    res.cookie("token",token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 *@name loginUser
 *@description login a existing user,expects username or email and a password in the req.body
 *@access Public
 */
async function loginUser(req,res){
    const{username,email,password}=req.body;

    if(!password || (!username && !email)){
        return res.status(400).json({
            message:"please give the credentials for login"
        })
    }

    const user=await userModel.findOne({
        $or:[{username},{email}]
    }).select("+password");

    if(!user){
        return res.status(400).json({
            message:"invalid credentials"
        })
    }
    const checkPassword=await bcrypt.compare(password,user.password);
    if(!checkPassword){
        return res.status(400).json({
            message:"username and password doesn't match"
        })
    }
    const token=jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token);
    res.status(200).json({
        message:"user logged in successsfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

/**
 *@name logoutUser
 *@description logout a user
 *@access Public
 */
async function logoutUser(req,res){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"user is not logged in"
        })
    }


    await blacklistModel.create({
        token
    })

    res.clearCookie("token");

    res.status(200).json({
        message:"user logged out successfully"
    });

}

/**
 *@name logoutUser
 *@description logout a user
 *@access Public
 */
async function getMe(req,res){
    const user=await userModel.findById(req.user.id);

    res.status(200).json({
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        },
        message:"user details fetched successfully"
    })
}
module.exports={registerUser,loginUser,logoutUser,getMe};