const mongoose=require('mongoose');
const {Schema}=mongoose;

const connectionRequestSchema=new Schema({
    fromUserId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"  //Reference to the user collection  
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","accepted","interested","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{timestamps:true})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    //Check if user is sending request to its own id
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);
