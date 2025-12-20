const express=require('express')
const User = require("../models/user");
const requestRouter=express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest=require('../models/connectionRequest')

//Profile Api
requestRouter.post("/request/send/:status/:toUserId", authUser, async (req, res) => {
  try {
    const fromUserId=req.user._id;
    const toUserId=req.params.toUserId;
    const status=req.params.status;

    const isAllowedStatus=["interested","ignored"]
    if(!isAllowedStatus.includes(status)){
      return res.json({message:"Invalid Status type"});
    }
    const existingRequest=await ConnectionRequest.findOne({$or:
      [{fromUserId,toUserId},
        {fromUserId:toUserId,toUserId:fromUserId}
      ]})
      if(existingRequest){
        return res.json({message:"Request already exists"})
      }

      const existstoUser=await User.findById(toUserId);
      if(!existstoUser){
        return res.json({message:"Connection sent to Invalid User"})
      }

    const connectionRequest=new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })   ;
    const data=await connectionRequest.save();

    
    console.log(emailRes)
    res.status(200).json({
      message:"Connection request sent successfully",
      data
    })

  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});

requestRouter.post("/request/review/:status/:requestId",authUser,async(req,res)=>{
  try {
    const {status,requestId}=req.params;
    const loggedInUser=req.user;
    const isAllowedStatus=["accepted","rejected"];
    if(!isAllowedStatus.includes(status)){
      return res.status(404).json({message:"Invalid status!"});
    }

    const existRequest=await ConnectionRequest.findOne({
      _id:requestId,
      toUserId:loggedInUser._id,
      status:"interested",
    });
   
    if(!existRequest){
      return res.status(404).json({message:"Request doesn't exist"});
    }
    existRequest.status=status;
    const data= await existRequest.save();
    res.status(200).json({
      message:"Request "+status,
      data
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("Error "+error.message);
  }
})
module.exports=requestRouter