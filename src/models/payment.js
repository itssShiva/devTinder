const mongoose=require('mongoose')
const {Schema,model}=require('mongoose')


const paymentSchema=new Schema({
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:String,
        required:true
    },
    receipt:{
        type:String,
        required:true
    },
    notes:{
        firstName:{
            type:String
        },
        lastName:{type:String},
        membershipType:{type:String}
    }
})
module.exports=model("Payment",paymentSchema);