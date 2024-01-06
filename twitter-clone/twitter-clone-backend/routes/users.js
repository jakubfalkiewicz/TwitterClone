const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User");
const passport = require("../auth/passportConfig");
const requireAuth = require("../auth/authMiddleware");
const upload = require("../multerMiddleware/uploadAvatar");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    res.status(500).json({
      message: "Failed to get the users",
      code: 500,
    });
  }
});

router.get("/authenticate", requireAuth, async (req, res) => {
  try {
    console.log(req.login);
    const user = await User.findOne({ login: req.login });
    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
});

router.post("/register", upload.single("file"), async (req, res) => {
  try {
    const user = { ...req.body, avatar: req.file.filename };
    User.create(user);
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(401).json({
        message: `Access Denied, ${err}`,
        code: 401,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ login: user.login });
    });
  })(req, res, next);
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("TSW-auth-cookie");
    res.status(200).json({
      message: "Logged out successfully",
      code: 401,
    });
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/follow", requireAuth, async (req, res) => {
  const userToFollow = req.body.followedId;
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user.follows.includes(userToFollow)) {
      user.follows = [...user.follows, userToFollow];
      await User.updateOne({ _id: req.userId }, user);
    }
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/unfollow", requireAuth, async (req, res) => {
  const userToUnfollow = req.body.unfollowedId;
  try {
    const user = await User.findOne({ _id: req.userId });
    console.log(user);
    if (user.follows.includes(userToUnfollow)) {
      user.follows = user.follows.filter((user) => user._id != userToUnfollow);
      await User.updateOne({ _id: req.userId }, user);
    }
  } catch (e) {
    throw new Error(e);
  }
});

router.get("/:username", requireAuth, async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ login: username });

    if (!user || user.length === 0) {
      return res.status(404).json({
        message: `User with login ${username} not found`,
        code: 404,
      });
    }
    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      code: 500,
    });
  }
});

router.put("/:userId", async (req, res) => {
  const id = req.params.userId;
  const user = User.find({ _id: id });
  const filter = { _id: id };
  const update = {
    login: req.body.login || user.login,
    email: req.body.email || user.email,
  };
  const updatedUser = await User.findByIdAndUpdate(filter, update);
  return res.send({ updatedUser: updatedUser });
});

router.delete("/deleteAll", async (req, res) => {
  await User.deleteMany({});
  return res.send("Deleted all");
});

router.delete("/:userId", async (req, res) => {
  const id = req.params.userId;
  const userToDelete = await User.findByIdAndDelete({ _id: id });
  return res.send({
    deletedUserId: id,
  });
});

router.patch("/:userId", async (req, res) => {
  const id = req.params.userId;
  return res.send({
    patchUserId: id,
  });
});

module.exports = router;
