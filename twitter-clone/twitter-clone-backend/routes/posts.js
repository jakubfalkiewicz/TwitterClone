const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const requireAuth = require("../auth/authMiddleware");

const getCurrentDate = () => {
  var dateTime = new Date();
  return (
    dateTime.getUTCHours() +
    ":" +
    dateTime.getUTCMinutes() +
    " " +
    dateTime.getUTCDate() +
    "/" +
    (dateTime.getUTCMonth() + 1) +
    "/" +
    dateTime.getUTCFullYear()
  );
};

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      timestamp: Date.now(),
      post: "Failed to get the posts",
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

    await Post.populate(posts, { path: "author" });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      author: post.author._id,
      authorName: post.author.login,
      authorAvatar: post.author.avatarUrl,
      date: post.date,
      text: post.text,
      photo: post.photo,
      reposts: post.reposts,
      views: post.views,
      comments: post.comments,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Post.find({ author: userId });
    await Post.populate(posts, { path: "author" });

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      author: post.author._id,
      authorAvatar: post.author.avatarUrl,
      authorName: post.author.login,
      date: post.date,
      text: post.text,
      photo: post.photo,
      reposts: post.reposts,
      views: post.views,
      comments: post.comments,
    }));

    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({
      post: "Failed to get the posts",
      code: 500,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const post = {
    ...req.body,
    author: req.userId,
    date: getCurrentDate(),
    comments: [],
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
