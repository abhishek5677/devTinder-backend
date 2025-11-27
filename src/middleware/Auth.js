const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid!!!");
    }

    const decodeObj = await jwt.verify(token, "DevTinder@123");

    const { _id } = decodeObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("something went wrong " + error.message);
  }
};

module.exports = { userAuth };
