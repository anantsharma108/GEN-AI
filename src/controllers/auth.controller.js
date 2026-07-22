const userModel=require('../models/user.model');
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
        res.status(400).json({
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

module.exports={registerUser};