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
    const connectionRequest=new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })   ;
    const data=await connectionRequest.save();
    res.status(200).json({
      message:"Connection request sent successfully",
      data
    })

  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});
module.exports=requestRouter