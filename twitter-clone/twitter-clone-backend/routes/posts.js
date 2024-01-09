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
      type: post.type,
      initialPost: post.initialPost,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:postId", requireAuth, async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    // .populate("initialPost");

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
    const posts = await Post.find({ author: userId })
      .populate("author")
      .populate("comments")
      .populate("initialPost");

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      author: post.author,
      //TODO: Check if needed
      authorAvatar: post.author.avatarUrl,
      authorName: post.author.login,
      date: post.date,
      text: post.text,
      photo: post.photo,
      reposts: post.reposts,
      views: post.views,
      comments: post.comments,
      type: post.type,
      initialPost: post.initialPost,
    }));

    res.json(formattedPosts);
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
