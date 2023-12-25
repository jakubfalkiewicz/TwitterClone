const express = require("express");
const app = express();
const passport = require("./auth/passportConfig");
const cookieSession = require("cookie-session");
const fs = require("fs");
const https = require("https");
const path = require("path");
const cors = require("cors");

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

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["https://localhost:5173"],
  })
);

const users = require("./routes/users");
const messages = require("./routes/messages");
const posts = require("./routes/posts");
app.use("/users", users);
app.use("/messages", messages);
app.use("/posts", posts);

require("dotenv").config();

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "./private.key")),
    cert: fs.readFileSync(path.join(__dirname, "./certificate.crt")),
  },
  app
);

const dbConnData = {
  host: process.env.MONGO_HOST || "127.0.0.1",
  port: process.env.MONGO_PORT || 27017,
  database: process.env.MONGO_DATABASE || "twitter-clone",
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
    const apiPort = process.env.PORT || 5000;
    const apiHost = process.env.API_HOST || "localhost";

    server.listen(apiPort, () => {
      console.log(`API server available from: https://${apiHost}:${apiPort}`);
    });
  })
  .catch((error) => console.error("Error connecting to MongoDB", error));
