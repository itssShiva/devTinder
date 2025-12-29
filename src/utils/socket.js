const socket=require('socket.io');

const socketInstance=(server)=>{
    const io=socket(server,{
    cors:{
        origin:"http://localhost:5173",
    }
})

io.on("connection",(socket)=>{
    socket.on("joinChat",()=>{})
    socket.on("sendMessage",()=>{})
    socket.on("disconnect",()=>{})
})
}
module.exports={socketInstance}