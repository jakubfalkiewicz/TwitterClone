const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  commentsLength: { type: Schema.Types.Number, default: 0 },
  date: { type: Date, required: true },
  disabled: { type: Schema.Types.Boolean, required: true, default: false },
  initialPost: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    default: null,
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
      select: "login avatar follows blocked",
    });
    // this.populate({ path: "comments", select: { initialPost: 0 } });
    this.populate({
      path: "initialPost",
    });
  } catch (err) {
    console.log(err.message);
  }
  next();
};

postSchema.virtual("imageUrl").get(function () {
  if (this.photo) {
    // return `https://192.168.113.86:5173/api/uploads/${this.photo}`;
    return `https://${process.env.API_HOST}:${process.env.API_PORT}/uploads/${this.photo}`;
  }
  return null;
});

postSchema.pre("find", autoPopulateFields).pre("findOne", autoPopulateFields);

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

module.exports = model("Post", postSchema);
