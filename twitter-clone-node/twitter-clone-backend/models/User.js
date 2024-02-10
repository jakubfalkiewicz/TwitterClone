const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const Notification = require("./Notification");

const saltRounds = 10; // You can adjust this based on your security requirements

const userSchema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  email: { type: String, required: false, default: "" },
  admin: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now, required: true },
  follows: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  blocked: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
    },
  ],
});

var autoPopulateFields = function (next) {
  try {
    this.populate({
      path: "notifications",
    });
  } catch (err) {
    console.log(err.message);
  }
  next();
};

userSchema.virtual("avatarUrl").get(function () {
  let avatar = this.avatar ? this.avatar : "avatar.png";
  return `https://192.168.0.164:${process.env.API_PORT}/uploads/${avatar}`;
  // return `https://${process.env.API_HOST}:${process.env.API_PORT}/uploads/${avatar}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre("find", autoPopulateFields).pre("findOne", autoPopulateFields);

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = model("User", userSchema);
