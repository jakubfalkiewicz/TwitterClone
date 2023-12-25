const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: { type: String, required: true },
  text: { type: String, required: true },
  photo: { type: String, required: false },
  comments: [
    {
      user: String,
      text: String,
      date: String,
    },
  ],
  reposts: [String],
  views: { type: Number, required: true },
});

module.exports = model("Post", postSchema);
