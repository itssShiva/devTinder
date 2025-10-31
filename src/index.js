const express = require("express");
const app = express();
const dbConnect = require("./config/database");
const User = require("./models/user");
const { signupValidations } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authUser } = require("./middlewares/auth");
dbConnect()
  .then(() => {
    console.log("DB connection successfull");
    app.listen(3000, () => {
      console.log("Server running at port ", 3000);
    });
  })
  .catch(() => {
    console.log("Issue while connectin to database");
  });

app.use(express.json());
app.use(cookieParser());

//Create User Api
app.post("/signup", async (req, res) => {
  try {
    signupValidations(req);
    //Creating a new instance of the User model
    const { firstName, lastName, emailId, password } = req.body;

    const hashedPasssword = await bcrypt.hash(password, 10);

    const record = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashedPasssword,
    });
    console.log(req.body);
    await record.save();
    res.send("User created successfully");
  } catch (error) {
    res.send("Issue while creating user " + error.message);
    console.log(error);
  }
});

//Login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email");
    }
    const userRecord = await User.findOne({ emailId: emailId });

    if (!userRecord) {
      throw new Error("User not found");
    }

    const isValidPassword = bcrypt.compare(password, userRecord.password);
    if (isValidPassword) {
      const token = await jwt.sign({ id: userRecord._id }, "devTinder@123", {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.status(200).send("Login successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});

//Profile Api
app.get("/profile", authUser, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send("Error " + error.message);
  }
});

//Get User Api
app.get("/getuser", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const record = await User.findOne({ emailId: userEmail });
    res.status(200).send(record);
  } catch (error) {
    console.log(error);
    res.status(404).send("Something went wrong " + error.message);
  }
});

//Get All User
app.get("/feed", async (req, res) => {
  try {
    const record = await User.find({});
    res.status(200).send(record);
  } catch (error) {
    console.log(error);
    res.status(404).send("Something went wrong " + error.message);
  }
});

//Delete the User

app.get("/deleteuser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const record = await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(404).send("Something went wrong " + error.message);
  }
});

//Update the User
app.patch("/updateuser/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const allowed_updates = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowed_updates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed");
    }
    if (data.skills && data?.skills.length > 5) {
      throw new Error("User cannot have more than 5 skills");
    }

    const record = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(record);
  } catch (error) {
    console.log(error);
    res.status(404).send("Something went wrong " + error.message);
  }
});

//update the user using email
app.patch("/updateemail", async (req, res) => {
  const userEmail = req.body.emailId;
  const data = req.body;
  try {
    const record = await User.findOneAndUpdate({ emailId: userEmail }, data, {
      new: true,
    });
    res.status(200).send(record);
  } catch (error) {
    console.log(error);
    res.status(404).send("Something went wrong " + error.message);
  }
});
