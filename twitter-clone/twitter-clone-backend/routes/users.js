const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("../auth/passportConfig");
const requireAuth = require("../auth/authMiddleware");
const upload = require("../multerMiddleware/uploadAvatar");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

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
    if (user) {
      return res.status(200).json(user);
    }
    res.status(401).send("User unauthenticated");
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
});

router.post("/register", upload.single("file"), async (req, res) => {
  try {
    const user = { ...req.body, avatar: req.file?.filename };
    User.create(user);
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const user = await User.findOne({ login: req.login });
    if (req.file && user.avatar) {
      const filePath = path.join(__dirname, "..", "uploads", user.avatar);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        } else {
          console.log("File deleted successfully");
        }
      });
    }
    let hashedPassword;
    if (req.body?.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }
    const userDb = await User.findOne({ login: req.body?.login });
    if (userDb) {
      return res.status(409).send("The username is already taken");
    }
    await User.findOneAndUpdate(
      { login: req.login },
      {
        login: req.body?.login ? req.body.login : user.login,
        password: hashedPassword || user.password,
        avatar: req.file?.filename || user.avatar,
      }
    );
    return res.status(200).send("Success");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
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
      res.status(200).json({ login: user.login, follows: user.follows });
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
    console.log(e);
    res.status(500).send(e.message);
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
    res.status(200).send("Success");
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/unfollow", requireAuth, async (req, res) => {
  const userToUnfollow = req.body.unfollowedId;
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user.follows.includes(userToUnfollow)) {
      user.follows = user.follows.filter((user) => user._id != userToUnfollow);
      await User.updateOne({ _id: req.userId }, user);
    }
    res.status(200).send("Success");
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/block", requireAuth, async (req, res) => {
  const userToBlock = req.body.userId;
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user.blocked.includes(userToBlock)) {
      user.blocked = [...user.blocked, userToBlock];
      await User.updateOne({ _id: req.userId }, user);
    }
    res.status(200).send("Success");
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/unblock", requireAuth, async (req, res) => {
  const userToUnblock = req.body.userId;
  try {
    const user = await User.findOne({ _id: req.userId });
    if (user.blocked.includes(userToUnblock)) {
      user.blocked = user.blocked.filter((user) => user._id != userToUnblock);
      await User.updateOne({ _id: req.userId }, user);
    }
    res.status(200).send("Success");
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

router.get("/search/:username", requireAuth, async (req, res) => {
  try {
    const username = req.params.username;
    const users = await User.find({
      login: { $regex: `${username}`, $options: "i" },
    });

    return res.status(200).send(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      code: 500,
    });
  }
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
