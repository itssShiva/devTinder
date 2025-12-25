const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { authUser } = require("../middlewares/auth");
const Payment=require('../models/payment')
const {RAZORPAY_KEY_SECRET, RAZORPAY_KEY_ID}=require('../secret')

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

module.exports = paymentRouter;
