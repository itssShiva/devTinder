const express=require('express')
const authRouter=express.Router();
const { signupValidations } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authUser } = require("../middlewares/auth");
const validator = require("validator");



//Create User Api
authRouter.post("/signup", async (req, res) => {
  try {
    signupValidations(req);
    //Creating a new instance of the User model
    const { emailId, password, age, skills } = req.body;

    const hashedPasssword = await bcrypt.hash(password, 10);

    const record = new User({
      firstName: emailId.split('@')[0], // Default firstName from email
      lastName: "User",
      emailId: emailId,
      password: hashedPasssword,
      age: age,
      skills: skills,
    });
    console.log(req.body);
    await record.save();
    
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
});

//Login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email");
    }
    const userRecord = await User.findOne({ emailId: emailId });

    if (!userRecord) {
      throw new Error("User not found");
    }

    const isValidPassword = await userRecord.validatePassword(password);
    if (isValidPassword) {
      const token = await userRecord.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      
      res.status(200).json(userRecord);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    const statusCode = error.message === "Invalid Email" ? 400 : 401;
    res.status(statusCode).json({ message: error.message });
  }
});

//Logout api

authRouter.post("/logout",(req,res)=>{
  res.cookie("token","")
  res.status(200).send("Logout Successfully");
})

module.exports=authRouter;