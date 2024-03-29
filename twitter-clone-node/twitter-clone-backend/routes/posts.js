const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const requireAuth = require("../auth/authMiddleware");
const upload = require("../multerMiddleware/uploadAvatar");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function handlePostsRoute(io) {
  const postViews = {};

  io.on("connection", function (socket) {
    socket.on("postView", async ({ postId, user }) => {
      postViews[postId] = postViews[postId] || [];

      const lastViewIndex = postViews[postId].findIndex(
        (view) => view.userId === user
      );

      if (
        lastViewIndex === -1 ||
        (Date.now() - postViews[postId][lastViewIndex].timestamp > 60000 &&
          user)
      ) {
        lastViewIndex === -1
          ? postViews[postId].push({ userId: user, timestamp: Date.now() })
          : (postViews[postId][lastViewIndex].timestamp = Date.now());

        await Post.updateOne({ _id: postId }, { $inc: { views: 1 } });
      }
    });
  });

  router.get("/", async (req, res) => {
    try {
      const posts = await Post.find({}).sort({ views: 1 });

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
    const lastIndexId = req.query.lastIndexId;
    const loadNewest = req.query.loadNewest;
    try {
      const user = await User.findById(userId).populate("follows");
      const followerIds = user.follows.map((follower) => follower._id);
      const posts = await Post.find({
        author: { $in: followerIds },
        type: "post",
      }).sort({ date: -1 });
      const lastIndex =
        posts
          .filter((post) => !post.author.blocked.includes(userId))
          .findIndex((post) => post._id == lastIndexId) + 1;

      if (loadNewest) {
        return res
          .status(200)
          .send(
            posts
              .filter((post) => !post.author.blocked.includes(userId))
              .slice(0, loadNewest)
          );
      }

      return res
        .status(200)
        .send(
          posts
            .filter((post) => !post.author.blocked.includes(userId))
            .slice(lastIndex, lastIndex + 5)
        );
    } catch (error) {
      console.error("Error fetching tweets:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get("/:postId", requireAuth, async (req, res) => {
    try {
      const postId = req.params.postId;
      const commentsReceived = req.query?.commentsReceived
        ?.split(",")
        .map((comment) => mongoose.Types.ObjectId(comment));
      const sliceSize = 5;
      if (commentsReceived) {
        const post = await Post.find({
          initialPost: postId,
          type: "comment",
          _id: { $nin: commentsReceived },
        })
          .sort({ date: -1 })
          .limit(sliceSize);
        if (post) {
          return res.json(post);
        } else {
          return res.status(400);
        }
      }
      const initialPost = await Post.findById(postId);
      const post = await Post.findById(postId)
        .populate({
          path: "comments",
          options: { sort: { date: -1 }, limit: sliceSize },
          select: { initialPost: 0 },
        })
        .populate({
          path: "reposts",
          options: { sort: { date: -1 } },
          select: { initialPost: 0 },
        });
      if (!post) {
        return res.status(404).json({ message: "Post not found", code: 404 });
      }
      post.commentsLength = initialPost.comments.filter(
        (comment) => !comment.disabled
      ).length;
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        post: "Failed to get the posts",
        code: 500,
      });
    }
  });

  router.put(
    "/:postId",
    upload.single("file"),
    requireAuth,
    async (req, res) => {
      const postId = req.params.postId;
      try {
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: "Post not found", code: 404 });
        }
        if (req.file && post.photo) {
          const filePath = path.join(__dirname, "..", "uploads", post.photo);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${err}`);
            } else {
              console.log("File deleted successfully");
            }
          });
        }
        await Post.findOneAndUpdate(
          { _id: req.params.postId },
          {
            text: req.body?.text ? req.body.text : post.text,
            photo: req.file ? req.file.filename : post.photo,
          }
        );
        const newPost = await Post.findById(postId);
        return res.status(200).send(newPost);
      } catch (err) {
        console.log(err.message);
        res.status(500).json({
          post: "Failed to get the posts",
          code: 500,
        });
      }
    }
  );

  router.get("/byUser/:userId", requireAuth, async (req, res) => {
    const userId = req.params.userId;
    const lastPostIndexId = req.query.lastPostIndexId;
    const lastCommentIndexId = req.query.lastCommentIndexId;
    try {
      const posts = await Post.find({ author: userId, type: "post" }).sort({
        date: -1,
      });
      const comments = await Post.find({
        author: userId,
        type: "comment",
      }).sort({ date: -1 });
      const lastPostIndex =
        posts.findIndex((post) => post._id == lastPostIndexId) + 1;
      const lastCommentIndex =
        comments.findIndex((post) => post._id == lastCommentIndexId) + 1;
      console.log(lastPostIndex);
      console.log(lastCommentIndex);

      res.json({
        posts: posts.slice(lastPostIndex, lastPostIndex + 5),
        comments: comments.slice(lastCommentIndex, lastCommentIndex + 5),
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        post: "Failed to get the posts",
        code: 500,
      });
    }
  });

  router.post("/", upload.single("file"), requireAuth, async (req, res) => {
    const post = {
      ...req.body,
      author: req.userId,
      date: new Date(),
      comments: [],
      reposts: [],
      notifications: [],
      photo: req.file?.filename,
      views: 0,
    };
    try {
      const dbPost = await Post.create(post);
      if (post.type === "comment") {
        const initialPost = await Post.findById(dbPost.initialPost);
        initialPost.comments = [...initialPost.comments, dbPost._id];
        await initialPost.save();
      }
      if (post.type === "post" && dbPost?.initialPost) {
        const initialPost = await Post.findById(dbPost.initialPost);
        initialPost.reposts = [...initialPost.reposts, dbPost._id];
        await initialPost.save();
      }
      const populatedPost = await Post.findById(dbPost._id);
      io.emit("newPost", populatedPost);
      res.send(populatedPost);
    } catch (error) {
      console.log(error.message);
      res.status(400);
      res.end(error.message);
    }
  });

  router.delete("/:postId", requireAuth, async (req, res) => {
    try {
      const postId = req.params.postId;
      const dbPost = await Post.findById(postId);
      if (dbPost.author.login === req.login) {
        await Post.updateMany(
          {
            $or: [{ comments: postId }, { reposts: postId }],
          },
          {
            $pull: {
              comments: postId,
              reposts: postId,
            },
          }
        );
        if (dbPost.comments.length + dbPost.reposts.length === 0) {
          if (dbPost.photo) {
            const filePath = path.join(
              __dirname,
              "..",
              "uploads",
              dbPost.photo
            );
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file: ${err}`);
              } else {
                console.log("File deleted successfully");
              }
            });
          }
          dbPost.remove();
          return res.send({ post: null });
        }

        const disabledPost = await Post.findByIdAndUpdate(postId, {
          disabled: true,
        });

        return res.send({ post: disabledPost });
      } else {
        res.send("Unauthorized action");
      }
    } catch (err) {
      res.send(err.message);
    }
  });

  // router.delete("/", requireAuth, async (req, res) => {
  //   try {
  //     const posts = (await Post.find()).forEach((post) => post.remove());

  //     res.send("success");
  //     // res.send(posts.filter((post) => post.initialPost?.disabled));
  //   } catch (err) {
  //     res.send(err.message);
  //   }
  // });
  return router;
}
module.exports = handlePostsRoute;
