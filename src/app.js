const express= require('express');
const app=express();
const authRoutes=require('./routes/auth.routes');
const interviewRouter = require("./routes/interview.routes");
const cookieParser=require('cookie-parser')

app.use(express.json());
app.use(cookieParser());



/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports=app;