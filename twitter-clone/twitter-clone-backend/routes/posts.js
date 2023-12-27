const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const requireAuth = require("../auth/authMiddleware");

const getCurrentDate = () => {
  var dateTime = new Date();
  return dateTime.getUTCHours() > 9
    ? dateTime.getUTCHours()
    : "0" + dateTime.getUTCHours() + ":" + dateTime.getUTCMinutes() > 9
    ? dateTime.getUTCMinutes()
    : "0" +
      dateTime.getUTCMinutes() +
      " " +
      dateTime.getUTCDate() +
      "/" +
      (dateTime.getUTCMonth() + 1) +
      "/" +
      dateTime.getUTCFullYear();
};

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.send(posts);
  } catch (err) {
    res.status(500).json({
      timestamp: Date.now(),
      post: "Failed to get the users",
      code: 500,
    });
  }
});

router.get("/feed", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("follows");

    const followerIds = user.follows.map((follower) => follower._id);

    const posts = await Post.find({ author: { $in: followerIds } });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const post = await Post.find({ author: userId });
    return res.send(post);
  } catch (err) {
    res.status(500).json({
      post: "Failed to get the users",
      code: 500,
    });
  }
});

router.get("/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const post = await Post.find({ author: userId });
    return res.send(post);
  } catch (err) {
    res.status(500).json({
      post: "Failed to get the users",
      code: 500,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const post = {
    ...req.body,
    author: req.userId,
    date: getCurrentDate(),
    reposts: [],
    views: 0,
  };
  try {
    Post.create(post);
    res.send(post);
  } catch (error) {
    res.status(400);
    res.end(error);
  }
});

module.exports = router;
