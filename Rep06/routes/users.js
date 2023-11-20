const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Configure passport to use the local strategy
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "login", passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({ login: username }).exec();
        if (!user) {
          return done("Incorrect login", null);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done("Incorrect password", null);
        }

        return done(null, user);
      } catch (error) {
        return done(error.message, null);
      }
    }
  )
);

// Pobranie danych wszystkich użytkowników
router.get("/", async (req, res) => {
  const users = await User.find({});
  return res.send(users);
});

// Utworzenie nowego użytkownika
router.post("/register", async (req, res) => {
  console.log(req.body);
  User.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

// Set up Express middleware for session management

// Define the login route using passport.authenticate
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
      res.status(200).json({ redirectTo: "/" });
    });
  })(req, res, next);
});

//Logowanie
// router.post("/login", async (request, response) => {
//   try {
//     const user = await User.findOne({ login: request.body.login }).exec();
//     if (!user) {
//       return response.status(400).send({ message: "The login does not exist" });
//     }
//     user.comparePassword(request.body.password, (error, match) => {
//       if (!match) {
//         return response
//           .status(400)
//           .send({ message: "The password is invalid" });
//       }
//     });
//     response.send({ ...user._doc, logged: true });
//   } catch (error) {
//     response.status(500).send(error);
//   }
// });

// Pobranie danych użytkownika o podanym userId
router.get("/:userId", async (req, res) => {
  const id = req.params.userId;
  const user = await User.find({ _id: id });
  return res.send(user);
});

// Zastąpienie danych użytkownika o podanym userId nowym „kompletem”
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

// Usuniecie użytkownika o podanym userId
router.delete("/:userId", async (req, res) => {
  const id = req.params.userId;
  const userToDelete = await User.findByIdAndDelete({ _id: id });
  return res.send({
    deletedUserId: id,
  });
});

// „Unacześnienie” wybranych danych użytkownika o podanym userId
router.patch("/:userId", async (req, res) => {
  const id = req.params.userId;
  return res.send({
    patchUserId: id,
  });
});

module.exports = router;
