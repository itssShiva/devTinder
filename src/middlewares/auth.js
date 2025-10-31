const jwt=require('jsonwebtoken');
const User=require('../models/user');
const authUser=async(req,res,next)=>{
try {
        const cookies=req.cookies;
    if(!cookies){
        throw new Error('Invalid Token')
    }
    const decoded=await jwt.verify(cookies.token,'devTinder@123');
    console.log(decoded.id);
    const id=decoded.id;
    const user=await User.findById(id);
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