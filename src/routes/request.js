const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/Auth");
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // allow only valid status
      const allowedStatusType = ["ignored", "interested"];

      if (!allowedStatusType.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      //check if the user exists or not
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(400).json({ message: "User does not exist" });
      }

      // check existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send({ message: "Request already exists" });
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newConnectionRequest.save();

      res.json({
        message: "Connection request sent successfully " + status,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);

module.exports = requestRouter;
