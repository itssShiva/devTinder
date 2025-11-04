const mongoose=require('mongoose');
const {Schema}=mongoose;

const connectionRequestSchema=new Schema({
    fromUserId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignore","accepted","interested","rejected"],
            message:`{Value} is incorrect status type`
        }
    }
},{timestamps:true})

module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);
