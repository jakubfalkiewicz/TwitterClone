const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const passport = require("../auth/passportConfig");
const requireAuth = require("../auth/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find({});
    return res.send(messages);
  } catch (err) {
    res.status(500).json({
      timestamp: Date.now(),
      message: "Failed to get the users",
      code: 500,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  console.log(req.body);
  Message.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

module.exports = router;
