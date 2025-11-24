const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./Models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcryptjs");

app.use(express.json());

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

    const validUser = await User.findOne({ emailId: emailId });

    if (!validUser) {
      throw new Error("Invalid credentilas");
    }

    const checkPassword = await bcrypt.compare(password, validUser?.password);

    if (checkPassword) {
      res.send("Successfully logged in!!");
    } else {
      throw new Error("Invalid credentilas");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong " + error.message);
  }
});

// get specific user
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });

    if (users.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

// get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(404).send("No user found");
    } else {
      res.send(users);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

// delete a user
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong");
  }
});

// update a user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills", "age", "gender"];

    const isUpdateAllowed = Object.keys(userData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (userData?.skills.length > 10) {
      throw new Error("cannot add more than 10 skills");
    }

    await User.findByIdAndUpdate(userId, userData, { runValidators: true });
    res.send("user updated successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(`something went wrong  ${error.message}`);
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
