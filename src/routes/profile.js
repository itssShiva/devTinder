const express=require('express')
const profileRouter=express.Router();
const User = require("../models/user");
const { authUser } = require("../middlewares/auth");

//Profile Api
profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});

module.exports=profileRouter;