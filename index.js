const express=require('express')
const app=express();


app.use('/test',(req,res)=>{
    res.send('Hello I m Test')
})
app.use('/',(req,res)=>{
    res.send('Hello I m Home')
})

app.listen(3000,()=>{
    console.log("Server running at port ",3000)
})