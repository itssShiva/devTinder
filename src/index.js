const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter=require('./routes/auth');
const profileRouter=require('./routes/profile');
const requestRouter=require('./routes/requests');
const userRouter=require('./routes/user')
const cors=require('cors');
const paymentRouter = require("./routes/payment");
const http=require('http');
const { socketInstance } = require("./utils/socket");


app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
}))

const server=http.createServer(app)

socketInstance(server);
dbConnect()
  .then(() => {
    console.log("DB connection successfull");
   
    server.listen(3000, () => {
      console.log("Server running at port ", 3000);
    });
  })
  .catch(() => {
    console.log("Issue while connecting to database");
  });

app.use(express.json());
app.use(cookieParser());
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);
app.use('/',paymentRouter);




