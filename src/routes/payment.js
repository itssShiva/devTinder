const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { authUser } = require("../middlewares/auth");
const Payment=require('../models/payment')
const {RAZORPAY_KEY_SECRET, RAZORPAY_KEY_ID}=require('../secret')
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const {RAZORPAY_WEBHOOK_SECRET}=require('../secret');
const User = require("../models/user");


paymentRouter.post("/user/payment/create", authUser, async (req, res) => {
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



paymentRouter.post('/webhook', async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    if (!webhookSignature) {
      return res.status(401).json({ message: "Invalid Signature" })
    }

    validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      RAZORPAY_WEBHOOK_SECRET
    );

    const paymentDetails = req.body.payload.payment.entity;
    const event = req.body.event;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id })
    if (!payment) {
      return res.status(404).json({ message: "Payment sequence not found" })
    }

    payment.status = paymentDetails.status;
    await payment.save();

    console.log("Webhook event received:", event, "Status:", paymentDetails.status);

    // Only upgrade if the payment is captured successfully
    if (event === "payment.captured") {
      const user = await User.findOne({ _id: payment.userId });
      if (user) {
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();
        console.log(`User ${user.firstName} upgraded to premium.`);
      }
    }

    return res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: error.message })
  }
})


paymentRouter.get("/user/premium/verify", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})



module.exports = paymentRouter;
