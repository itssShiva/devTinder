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

app.use(express.json());

//Create User Api
app.post('/signup',async(req,res)=>{
    try {
        //Creating a new instance of the User model
        const record=new User(req.body)  
        console.log(req.body)
    await record.save();
    res.send("User created successfully");

    } catch (error) {
        res.send("Issue while creating user");
        console.log(error)
    }
})

//Get User Api
app.get('/getuser',async(req,res)=>{
    const userEmail=req.body.email;
    try {
        const record=await User.findOne({emailId:userEmail});
        res.status(200).send(record);
    } catch (error) {
        console.log(error);
        res.status(404).send("Something went wrong");
    }
})

//Get All User
app.get('/feed',async(req,res)=>{
    try {
         const record=await User.find({});
         res.status(200).send(record)
    } catch (error) {
         console.log(error);
        res.status(404).send("Something went wrong");
    }

})





