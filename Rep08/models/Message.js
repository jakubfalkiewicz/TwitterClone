const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  user: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = model("Message", messageSchema);
