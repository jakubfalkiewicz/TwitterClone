const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: { type: String, required: true },
  text: { type: String, required: true },
  photo: { type: String, required: false },
  type: {
    type: String,
    enum: ["post", "comment"],
    default: "post",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  reposts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  initialPost: { type: Schema.Types.ObjectId, ref: "Post", required: false },
  views: { type: Number, required: true },
});

module.exports = model("Post", postSchema);
