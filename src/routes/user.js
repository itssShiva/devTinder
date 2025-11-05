const express=require('express')
const userRouter=express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest=require('../models/connectionRequest')


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

module.exports=userRouter;