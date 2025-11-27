const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./Models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const user = require("./Models/user");
const { userAuth } = require("./middleware/Auth");

app.use(express.json());
app.use(cookieParser());

// add user
app.post("/signup", async (req, res) => {
  try {
    // validation of the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(`Error:  ${error.message}`);
  }
});

// login user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentilas");
    }

    const checkPassword = await user.validatePassword(password);

    if (checkPassword) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("Successfully logged in!!");
    } else {
      throw new Error("Invalid credentilas");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong " + error.message);
  }
});

// get user profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
