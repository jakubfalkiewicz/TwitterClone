require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const User = require("./models/User");
const axios = require("axios");
const Room = require("./models/Room");
const mongoose = require("mongoose");

const { engine } = require("express-handlebars");
var expressHbs = require("express-handlebars");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

var hbs = expressHbs.create({});
hbs.handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

const dbConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "lab05",
};

const db_url = `mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`;

// Dodajemy usługi REST, które należy zdefiniować w pliku „users.js”
// znajdującym się w podkatalogu „routes”
const users = require("./routes/users");
const roomsAPI = require("./routes/rooms");

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/api/users", users);
app.use("/api/rooms", roomsAPI);

app.get("/", async (req, res) => {
  const users = await axios
    .get("http://localhost:3000/api/users/")
    .then((response) => response.data)
    .catch((err) => console.log(err));
  res.render("home", { users });
});

app.get("/login", async (req, res) => {
  const users = await axios
    .get("http://localhost:3000/api/users/")
    .then((response) => response.data);
  res.render("login", { users });
});

app.get("/register", async (req, res) => {
  const users = await axios
    .get("http://localhost:3000/api/users/")
    .then((response) => response.data);
  res.render("register", { users });
});

app.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await axios
    .get(`http://localhost:3000/api/users/${userId}`)
    .then((response) => response.data[0]);
  if (user != undefined) {
    res.render("userView", { user });
  } else {
    res.send("User with such id doesnt exist");
  }
});

app.get("/rooms/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  if (roomId != undefined) {
    res.render("roomView", { roomId, users });
  } else {
    res.send("User with such id doesnt exist");
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ message: "Page not found", statusCode: 404 });
});

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(
      `Connected to MongoDB. Database name: "${response.connections[0].name}"`
    );
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));

const apiPort = process.env.PORT || 3000;
const apiHost = process.env.API_HOST || "localhost";

const server = app.listen(apiPort, () => {
  console.log(`API server available from: http://${apiHost}:${apiPort}`);
});


const io = require("socket.io")(server);

const rooms = io.of(/^\/rooms\/\w+$/).on("connection", (socket) => {
  const { name } = socket.nsp;
  socket.on("message", async (message, author) => {
    if (!message) return;
    const users = await axios
      .get("http://localhost:3000/api/users/")
      .then((response) => response.data);
    const sender = users.filter((el) => el._id == author)[0].login;
    const roomId = name.split("/")[2];
    const dbRoom = await Room.findById(roomId);
    dbRoom.messages.push({ author: sender, message: message });
    await dbRoom.save();
    socket.broadcast.emit("message", { sender, message });
  });
});

app.io = io;
