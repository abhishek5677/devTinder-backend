const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./Models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "virat",
    lastName: "kohli",
    password: "virat@123",
    emailId: "virat@gmail.com",
    age: 22,
    gender: "male",
  });

  try {
    const savedUser = await user.save();
    console.log(savedUser); // See saved data in terminal
    res.send("User added successfully");
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
