const express=require('express')
const userRouter=express.Router();
const { authUser } = require("../middlewares/auth");
const ConnectionRequest=require('../models/connectionRequest')
const User=require('../models/user')

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
            {toUserId:loggedInUser._id,status:"accepted"}
        ]
    }).populate("fromUserId","firstName lastName")
    .populate("toUserId","firstName lastName")

    const data=connections.map((row)=>
    {
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    }
    );
    res.json({data});
   } catch (error) {
    res.send("Error "+error.message)
   }
})

//API for users feed
userRouter.get('/feed',authUser,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        const skip=(page-1)*limit;
        limit=limit>50?50:limit;
    const connectionRequest=await ConnectionRequest.find({
        $or:[{fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
    }).select("fromUserId toUserId");

    const hideUsersfromFeed=new Set();
    connectionRequest.forEach(req=>{
        hideUsersfromFeed.add(req.fromUserId);
        hideUsersfromFeed.add(req.toUserId);
    })

    const user=await User.find({
        $and:[{_id:{$nin:Array.from(hideUsersfromFeed)}},
                {_id:{$ne:loggedInUser._id}}
        ]
    }).select("firstName lastName").skip(skip).limit(limit);

    res.send(user)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
})
module.exports=userRouter;