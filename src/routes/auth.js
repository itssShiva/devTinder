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
    const { firstName, lastName, emailId, password } = req.body;

    const hashedPasssword = await bcrypt.hash(password, 10);

    const record = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashedPasssword,
    });
    console.log(req.body);
    await record.save();
    res.send("User created successfully");
  } catch (error) {
    res.send("Issue while creating user " + error.message);
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
      res.status(200).send("Login successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});

module.exports=authRouter;