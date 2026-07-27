const jwt=require('jsonwebtoken');
const blackListModel=require('../models/blacklist.model')

async function authUser(req,res,next){
    const token=req.cookies.token;

    const isBlackListed=await blackListModel.findOne({token});
    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message:"invalid token"
        })
    }

}

module.exports=authUser;