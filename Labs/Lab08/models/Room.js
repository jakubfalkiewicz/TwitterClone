const { Schema, model } = require("mongoose");

// Pole „_id” (które ma modelować roomId) dodawane jest domyślnie, dlatego pomijamy je w deklaracji
const roomSchema = new Schema({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  messages: [
    {
      author: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
});

module.exports = model("Room", roomSchema);
