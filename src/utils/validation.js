const validator=require('validator');
const { aggregate } = require('../models/user');

const signupValidations=(req)=>{
    const{firstName,emailId,password}=req.body;
    if(!firstName||!emailId||!password){
        throw new Error("firstName,emailId,password cannot be empty");
    }
    if(firstName.length<4||firstName.length>50){
        throw new Error("first name should be between 4-50 characters");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Make a strong passsword");
    }
}

const editProfileValidation=(req)=>{
    const allowedEditFields=["firstName","lastName","about","emailId","age","gender","photoUrl","about","skills"];
   const editAllows= Object.keys(req.body).every((field)=>allowedEditFields.includes(field))
   return editAllows;
}

const passwordValidation=(req)=>{
    
}

module.exports={signupValidations,editProfileValidation}