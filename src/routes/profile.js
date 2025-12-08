const express=require('express')
const profileRouter=express.Router();
const User = require("../models/user");
const { authUser } = require("../middlewares/auth");
const{editProfileValidation}=require('../utils/validation')
const bcrypt=require('bcrypt');

//Profile Api
profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});


//Edit profille Api
profileRouter.patch('/profile/edit',authUser,async(req,res)=>{
     try {
       if(!editProfileValidation(req)){
        throw new Error("Invalid edit fields");
      }
      const loggedInUser=req.user;
     Object.keys(req.body).forEach((field) => {
  loggedInUser[field] = req.body[field];
});

await loggedInUser.save();

      res.status(200).json({
        message:`${loggedInUser.firstName}, your profile updated successfully `,
        data:loggedInUser
      })
     } catch (error) {
      console.log(error);
      res.send("Error "+error.message)
     }
})

//Edit Profile Password
profileRouter.patch('/profile/password',authUser,async(req,res)=>{
try {
    const user=req.user;
    const {oldPassword,newPassword}=req.body;
    if(!oldPassword||!newPassword){
      throw new Error("Old and new both password required!!")
    }
    const isMatch=await bcrypt.compare(oldPassword,user.password);
    if(!isMatch){
      throw new Error("Old password is not correct");
    }
    const hashedPasssword=await bcrypt.hash(newPassword,10);
    user.password=hashedPasssword;
    await user.save();
    res.status(200).json({message:"Password updated successfully"});
} catch (error) {
   console.log(error);
     res.send("Error "+error.message)
}   
   
})

module.exports=profileRouter;