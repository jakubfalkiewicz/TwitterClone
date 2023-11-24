const express = require("express");
const axios = require("axios");
const app = express();
const User = require("./models/User");
const passport = require("passport");
const cookieSession = require("cookie-session");
const socketIO = require("socket.io");

app.use(
  cookieSession({
    name: "TSW-auth-cookie",
    keys: ["sekrecik"],
    maxAge: 60 * 60 * 1000,
  })
);

app.use(express.json());
// Initialize passport and the express-session middleware
app.use(passport.initialize());
app.use(passport.session());

// Serialize user into the session
passport.serializeUser((user, done) => {
  return done(null, user?.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const { engine } = require("express-handlebars");
var expressHbs = require("express-handlebars");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

var hbs = expressHbs.create({});
hbs.handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

app.get("/", async (req, res) => {
  const users = await axios
    .get("http://localhost:3000/users/")
    .then((response) => response.data)
    .catch((err) => console.log(err));
  res.render("home", { users });
});

app.get("/login", async (req, res) => {
  const users = await axios
    .get("http://localhost:3000/users/")
    .then((response) => response.data);
  res.render("login", { users });
});

app.get("/register", async (req, res) => {
  const users = await axios
    .get("http://localhost:3000/users/")
    .then((response) => response.data);
  res.render("register", { users });
});

app.get("/globalChat", async (req, res) => {
  res.render("globalChat");
});

app.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    const user = response.data[0];
    res.render("userView", { user });
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Handle authentication error
      const errorMessage = err.response.data.message;
      res.send(errorMessage); // Render an error page with the message
    } else {
      res.send("An unexpected error occurred");
    }
  }
});

// Dodajemy usługi REST, które należy zdefiniować w pliku „users.js” znajdującym się w podkatalogu „routes”
const users = require("./routes/users");
app.use("/users", users);
// app.use("/", express.static(__dirname, +"/public"));
app.use(express.static("public"));

require("dotenv").config();
const dbConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "lab05",
};

const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
    const apiPort = process.env.PORT || 3000;
    const apiHost = process.env.API_HOST || "localhost";
    const server = app.listen(apiPort, () => {
      console.log(`API server available from: http://${apiHost}:${apiPort}`);
    });
    const io = socketIO(server);
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
