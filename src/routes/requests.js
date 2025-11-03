const express=require('express')
const User = require("../models/user");
const requestRouter=express.Router();
const { authUser } = require("../middlewares/auth");
//Profile Api
requestRouter.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    console.log('Sending the connection request');
    res.send(user.firstName+" send the connection request");
  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});
module.exports=requestRouter