const express = require("express");
const router = express.Router();

const Room = require("../models/Room");

// Pobranie danych wszystkich pokoi
router.get("/", async (req, res) => {
  const rooms = await Room.find({});
  return res.send(rooms);
});

// Utworzenie nowego pokoju
router.post("/", async (req, res) => {
  Room.create(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      res.end(error);
    });
});

router.put("/:roomId", async (req, res) => {
  const id = req.params.roomId;
  const room = await Room.find({ _id: id });
  const filter = { _id: id };
  const oldMessages = room[0].messages;
  const newMessages = oldMessages.push(req.body.message);
  console.log(room[0].messages[0]);
  const messageList = room[0].messages.push(req.body.message);
  const update = {
    messages: room[0].messages[0],
  };
  const updatedRoom = await Room.findByIdAndUpdate(filter, update);
  return res.send({ updatedRoom: updatedRoom });
});

// Pobranie danych pokoju o podanym roomId
router.get("/:roomId", async (req, res) => {
  const id = req.params.roomId;
  const room = await Room.find({ _id: id });
  return res.send(room);
});

// Usuniecie pokoju o podanym roomId
router.delete("/:roomId", async (req, res) => {
  const id = req.params.roomId;
  const roomToDelete = await Room.findByIdAndDelete({ _id: id });
  return res.send({
    deletedRoomId: id,
  });
});

module.exports = router;
