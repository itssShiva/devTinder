const { SESClient } = require("@aws-sdk/client-ses");
const {AWS_SES_SECRET_KEY}=require('../secret')
const{AWS_SECRET_ACCESS}=require('../secret')
// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
const sesClient = new SESClient({ region: REGION,credentials:{
    accessKeyId:AWS_SECRET_ACCESS,
    secretAccessKey:AWS_SES_SECRET_KEY,
}});
module.exports={sesClient};
// snippet-end:[ses.JavaScript.createclientv3]