const express=require('express')
const userRouter=express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest=require('../models/connectionRequest')

//API for fetching the pending request for a user
userRouter.get("/user/request/received",authUser,async(req,res)=>{
   try {
     const loggedInUser=req.user;
    const requestPending=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
    }).populate("fromUserId","firstName lastName")
    //we can also write like this
    // .populate("User",["firstName","lastName"])
    return res.status(200).json({
        message:"Data fetched successfully",
        data:requestPending,
    })
   } catch (error) {
    console.log(error);
    res.send("Error "+error.message);
   }
})

//API for fetching the accepted request(connections) for user
userRouter.get("/user/connections",authUser,async(req,res)=>{
   try {
     const loggedInUser=req.user;
    const connections=await ConnectionRequest .find({
        $or:[
            {fromUserId:loggedInUser._id,status:"accepted"},
            {toUserId:loggedInUser._id,stauts:"accepted"}
        ]
    }).populate("fromUserId","firstName lastName");

    const data=connections.map((row)=>row.fromUserId);
    res.json({data});
   } catch (error) {
    res.send("Error "+error.message)
   }
})
module.exports=userRouter;