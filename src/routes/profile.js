const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/Auth");
const {
  validateEditProfileData,
  validateForgotPasswordData,
} = require("../utils/validation");
const User = require("../Models/user");
const bcrypt = require("bcryptjs");

// get user profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

//edit user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send("user updated successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

// user forgot password
profileRouter.post("/profile/forgot-passowrd", userAuth, async (req, res) => {
  try {
    validateForgotPasswordData(req);
    const { emailId, oldPassword, newPassword } = req.body;

    // Check User Exists
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }

    // Check Old Password
    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Old password is incorrect");
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.send("Password changed successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong " + error.message);
  }
});

module.exports = profileRouter;
