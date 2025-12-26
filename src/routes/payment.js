const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { authUser } = require("../middlewares/auth");
const Payment=require('../models/payment')
const {RAZORPAY_KEY_SECRET, RAZORPAY_KEY_ID}=require('../secret')
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const {RAZORPAY_WEBHOOK_SECRET}=require('../secret');
const User = require("../models/user");


 paymentRouter.post("/payment/create", authUser, async (req, res) => {
  try {
    const {firstName,lastName,emailId}=req.user
    const{membershipType}=req.body;
    const amount=(membershipType=='silver')?300:700
    
   const order= await razorpayInstance.orders.create({
      amount: amount*100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId:emailId,
        membershipType
      },
    });

    
   

    const savedPayment=await Payment.create({
      userId:req.user._id,
      orderId:order.id,
      status:order.status,
      amount:order.amount,
      receipt:order.receipt,
      notes:order.notes,
      membershipType:membershipType
    })

    res.json({order,key:RAZORPAY_KEY_ID});

  } catch (error) {
    console.log(error);
  }
});



paymentRouter.post('/payment/webhook',async(req,res)=>{
  try {

    const webhookSignature=req.get("X-Razorpay-Signature");
    validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      RAZORPAY_WEBHOOK_SECRET
    );

    if(!webhookSignature){
      return res.status(500).json({message:"Signature is invalid"})
    }

    const paymentDetails=req.body.payload.payment.entity;

    const payment=await Payment.findOne({orderId:paymentDetails.order_id})
    payment.status=paymentDetails.status;
    await payment.save();

    const user=await User.findOne({_id:payment.userId});
    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    await user.save();

  } catch (error) {
    return res.status(500).json({message:error.message})
  }
})


paymentRouter.get("/premium/verify",authUser,async(req,res)=>{
  const user=req.user;
  if(user.isPremium){
    return res.json({isPremium:true})
  }
  return res.json({isPremium:false})
})
module.exports = paymentRouter;
