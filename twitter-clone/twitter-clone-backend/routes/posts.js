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

    res.json(posts);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:postId", requireAuth, async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).populate({
      path: "comments",
      select: { initialPost: 0 },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found", code: 404 });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      post: "Failed to get the posts",
      code: 500,
    });
  }
});

router.get("/byUser/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Post.find({ author: userId });

    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      post: "Failed to get the posts",
      code: 500,
    });
  }
});

router.post("/", requireAuth, async (req, res) => {
  console.log(req.body);
  const post = {
    ...req.body,
    author: req.userId,
    date: getCurrentDate(),
    comments: [],
    reposts: [],
    views: 0,
  };
  try {
    const dbPost = await Post.create(post);
    if (post.type === "comment") {
      const initialPost = await Post.findById(dbPost.initialPost);
      initialPost.comments = [...initialPost.comments, dbPost._id];
      await initialPost.save();
    }
    if (post.type === "post") {
      const initialPost = await Post.findById(dbPost.initialPost);
      initialPost.reposts = [...initialPost.reposts, dbPost._id];
      await initialPost.save();
    }
    await Post.findById(dbPost._id);
    res.send(dbPost);
  } catch (error) {
    console.log(error.message);
    res.status(400);
    res.end(error.message);
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    const dbPost = await Post.findById(req.params.postId);
    dbPost.delete();
    res.send("Post deleted successfully");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
