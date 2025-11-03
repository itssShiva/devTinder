const express=require('express')
const profileRouter=express.Router();
const User = require("../models/user");
const { authUser } = require("../middlewares/auth");
const{editProfileValidation}=require('../utils/validation')

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
profileRouter.post('/profile/edit',authUser,async(req,res)=>{
     try {
       if(!editProfileValidation(req)){
        throw new Error("Invalid edit fields");
      }
      const loggedInUser=req.user;
      Object.keys(req.body).every((field)=>loggedInUser[field]=req.body[field]);
      res.status(200).json({
        message:`${loggedInUser.firstName}, your profile updated successfully `,
        data:loggedInUser
      })
     } catch (error) {
      console.log(error);
      res.send("Error "+error.message)
     }
})

module.exports=profileRouter;