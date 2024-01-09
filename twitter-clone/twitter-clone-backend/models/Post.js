const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  date: { type: String, required: true },
  initialPost: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  photo: { type: String, required: false },
  reposts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ["post", "comment"],
    default: "post",
  },
  views: { type: Number, required: true },
});

var autoPopulateFields = function (next) {
  try {
    this.populate({
      path: "author",
      select: "login avatarUrl follows blocked",
    });
    this.populate("comments");
    // this.populate("initialPost");
  } catch (err) {
    console.log(err.message);
  }

  next();
};

postSchema.pre("find", autoPopulateFields).pre("findOne", autoPopulateFields);

module.exports = model("Post", postSchema);
