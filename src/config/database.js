const mongoose=require('mongoose');
require("dotenv").config();
const {MONGO_URL}=require('../secret');

const dbConnect=async()=>{
    await mongoose.connect(MONGO_URL);
}
module.exports=dbConnect;