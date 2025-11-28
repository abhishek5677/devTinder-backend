const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../Models/user");
const bcrypt = require("bcryptjs");

// add user
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
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

// logout user
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout successfully");
});

module.exports = authRouter;
