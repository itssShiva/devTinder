const express=require('express')
const app=express();
const dbConnect=require('./config/database');
const User=require("./models/user")

dbConnect()
.then(()=>{
    console.log('DB connection successfull');
    app.listen(3000,()=>{
    console.log("Server running at port ",3000)
})
})
.catch(()=>{
    console.log('Issue while connectin to database');
})

app.post('/signup',async(req,res)=>{

    try {
        const record=new User({
        firstName:"Shiva",
        lastName:"Gupta",
        emailId:"shiva@gmail.com",
        password:"123",
        age:24,
        gender:"male"
    })  
    await record.save();
    res.send("User created successfully");

    } catch (error) {
        res.send("Issue while creating user");
        console.log(error)
    }
})



