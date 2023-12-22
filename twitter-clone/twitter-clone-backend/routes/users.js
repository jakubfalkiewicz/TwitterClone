const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("../auth/passportConfig");
const requireAuth = require("../auth/authMiddleware");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    res.status(500).json({
      timestamp: Date.now(),
      message: "Failed to get the users",
      code: 500,
    });
  }
});

router.get("/authenticate", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ logIn: req.login });
    console.log(user);
    res.status(200).json(user);
  } catch (e) {
    throw new Error(e);
  }
});

router.post("/register", async (req, res) => {
  User.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(401).json({
        timestamp: Date.now(),
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
      timestamp: Date.now(),
      message: "Logged out successfully",
      code: 401,
    });
  } catch (e) {
    throw new Error(e);
  }
});

router.get("/:userId", requireAuth, async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.find({ _id: id });

    // Handle the case where no user is found with the given ID
    if (!user || user.length === 0) {
      return res.status(404).json({
        timestamp: Date.now(),
        message: `User with ID ${id} not found`,
        code: 404,
      });
    }
    // If the user is found, send the user data in the response
    return res.send(user);
  } catch (error) {
    console.error(error);
    // Handle unexpected errors with a generic message
    return res.status(500).json({
      timestamp: Date.now(),
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
