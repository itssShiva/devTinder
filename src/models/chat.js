const mongoose=require('mongoose')
const {Schema,model}=mongoose;


const messageSchema=new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    newMessage:{
        type:String,
        required:true,
    }
},{ timestamps: true })

const chatSchema=new Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }],
    messages:[messageSchema],
})

module.exports=model("Chat",chatSchema);