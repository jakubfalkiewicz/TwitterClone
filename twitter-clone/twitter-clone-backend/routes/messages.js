const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const requireAuth = require("../auth/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find({});
    return res.send(messages);
  } catch (err) {
    res.status(500).json({
      message: "Failed to get the users",
      code: 500,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const message = { ...req.body, user: req.username };
  Message.create(message)
    .then((result) => {
      res.send(message);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

module.exports = router;
