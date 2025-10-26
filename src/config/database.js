const mongoose=require('mongoose');

const dbConnect=async()=>{
    await mongoose.connect("mongodb+srv://shiva262architect_db_user:1QnYeBNaWpLhvRCP@devtinder.lzxuyim.mongodb.net/devTinder");
}
module.exports=dbConnect;