const mongoose=require('mongoose');

const blackListSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});

blackListSchema.index({ createdAt: 1 },{expireAfterSeconds: 3600*24*3}); // Set the TTL index to expire after 1 hour (3600 seconds)

const blackListModel=mongoose.model('blackListed',blackListSchema);

module.exports=blackListModel;