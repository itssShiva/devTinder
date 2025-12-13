const jwt=require('jsonwebtoken');
const User=require('../models/user');
const {JWT_SECRET}=require('../secret')
const authUser=async(req,res,next)=>{
try {
        const token=req.cookies.token;
    if(!token){
       return res.status(401).send("Please Login!!");
    }
    const decoded= jwt.verify(token,JWT_SECRET);
    console.log(decoded.id);
    const id=decoded.id;
    if(!user){
        throw new Error("User not found!")
    }
        req.user=user;
        next();

    } catch (error) {
        console.log(error);
        res.status(404).send("Error "+error.message);
    }
}
module.exports={authUser}