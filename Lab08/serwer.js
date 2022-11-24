const express = require("express");
const axios = require("axios");
const app = express();
const User = require("./models/User");
const socket = require("socket.io");

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
app.use(
  require("express-session")({
    secret: "sekrecik",
    resave: false,
    saveUninitialized: false,
  })
);

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

app.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await axios
    .get(`http://localhost:3000/users/${userId}`)
    .then((response) => response.data[0]);
  if (user != undefined) {
    res.render("userView", { user });
  } else {
    res.send("User with such id doesnt exist");
  }
});

app.get("/profile/:userId/chat", async (req, res) => {
  const userId = req.params.userId;
  const user = await axios
    .get(`http://localhost:3000/users/${userId}`)
    .then((response) => response.data[0]);
  if (user != undefined) {
    res.render("chatView", { user });
  } else {
    res.send("User with such id doesnt exist");
  }
});

app.get("/room/:roomId", async (req, res) => {
  const roomId = req.params.roomId;

  if (roomId != undefined) {
    res.render("roomView", { roomId });
  } else {
    res.send("User with such id doesnt exist");
  }
});
// app.listen(3000, () => console.log("listening on port 3000"));

// Dodajemy usługi REST, które należy zdefiniować w pliku „users.js”
// znajdującym się w podkatalogu „routes”
const users = require("./routes/users");
app.use("/users", users);
const rooms = require("./routes/rooms");
app.use("/rooms", rooms);
// app.use("/", express.static(__dirname, +"/public"));
app.use(express.static("public"));

// Wczytujemy ewentualne dane konfiguracyjne z pliku „.env”
require("dotenv").config();
const dbConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "lab05",
};

// Do kontaktu z serwerem MongoDB wykorzystamy bibliotekę Mongoose
const mongoose = require("mongoose");
const { response } = require("express");
var clients = [];

// Łączymy się z bazą MongoDB i jeśli się to uda, uruchamiamy serwer API.
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
    const io = socket(server);
    io.on("connection", (socket) => {
      console.log("someone joined")
      socket.on("join-room", function (room) {
        socket.join(room);
      });
      socket.on("room-message", (msg) => {
        console.log("SERVER GOT ROOM MESSAGE")
        socket.emit("room-message", msg);
      });
      socket.on("chat-message", (msg, recieverId, sender) => {
        console.log("Server received message");
        if (recieverId) {
          console.log("Server sends message");
          socket.join(recieverId);
          // io.emit("receive-message", msg, sender);
          io.to(recieverId).emit("receive-message", msg, sender);
          socket.to(recieverId).emit("receive-message", msg, sender);
        } else {
          console.log("Server didnt receive room id");
          socket.emit("receive-message", msg);
        }
        console.log(`message to socket ID(${recieverId}): ` + msg);
      });

      socket.on("storeClientInfo", function (data) {
        var clientInfo = new Object();
        clientInfo.customId = data.customId;
        clientInfo.clientId = socket.id;
        clients.push(clientInfo);
        console.log(clients);
      });

      socket.on("get-room-owner-id", (roomId) => {
        // console.log("GET_ID" + clients);
        const clientId = clients.filter((el) => el.customId == roomId);
        if (clientId[0] != undefined) {
          io.emit("receive-id", clientId[0].clientId);
        }
      });
      socket.emit("receive-message", "Welcome to the chat!");

      socket.on("disconnect", function (data) {
        for (var i = 0, len = clients.length; i < len; ++i) {
          var c = clients[i];

          if (c.clientId == socket.id) {
            clients.splice(i, 1);
            break;
          }
        }
      });
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
