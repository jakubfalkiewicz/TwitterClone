const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Serialize user into the session
passport.serializeUser((user, done) => {
  return done(null, user?.id);
});

//PRZEKAZYWAĆ NIE TYLKO ID ALE TEŻ USERNAME (DLA CZATU)

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport.use(
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
