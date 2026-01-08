const express=require('express');
const { authUser } = require('../middlewares/auth');
const Chat = require('../models/chat');
const chatRouter=express.Router();

chatRouter.get('/chat/:targetUserId',authUser,async(req,res)=>{
   try {
     const userId=req.user._id;
    const {targetUserId}=req.params;
    let chat=await Chat.findOne({
        participants:{$all:[userId,targetUserId]}
    })
    .populate({
        path:"messages.senderId",
        select:"firstName lastName"
    })

    if(!chat){
        chat=new Chat({
            participants:[userId,targetUserId],
            messages:[],
        })
    }
    await chat.save();

    res.json(chat);
   } catch (error) {
    console.log(error)
   }

})



module.exports=chatRouter;