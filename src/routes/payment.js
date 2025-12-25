const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const { authUser } = require("../middlewares/auth");
const Payment=require('../models/payment')

 paymentRouter.post("/payment/create", authUser, async (req, res) => {
  try {
   const order= await razorpayInstance.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: "value3",
        lastName: "value2",
      },
    });

    
   

    const savedPayment=await Payment.create({
      userId:req.user._id,
      orderId:order.id,
      status:order.status,
      amount:order.amount,
      receipt:order.receipt,
      notes:order.notes
    })

    res.json(order);

  } catch (error) {
    console.log(error);
  }
});

module.exports = paymentRouter;
