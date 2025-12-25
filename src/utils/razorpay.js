    const {RAZORPAY_KEY_ID}=require('../secret.js')
    const {RAZORPAY_KEY_SECRET}=require('../secret.js')
    const Razorpay=require('razorpay');
    
    const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
    });

    module.exports=razorpayInstance;
