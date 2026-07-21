const mongoose=require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('server is connected to database');
    }catch(err){
        console.log('error while connecting to database');
        process.exit(1);
    }
}

module.exports=connectDB;