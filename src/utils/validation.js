const validator=require('validator');

const signupValidations=(req)=>{
    const{emailId,password,age,skills}=req.body;
    if(!emailId||!password){
        throw new Error("emailId and password cannot be empty");
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