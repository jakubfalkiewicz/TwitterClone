const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10; // You can adjust this based on your security requirements

const userSchema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  email: { type: String, required: false, default: "" },
  admin: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  follows: [{ type: Schema.Types.ObjectId, ref: "User" }],
  blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

userSchema.virtual("avatarUrl").get(function () {
  let avatar = this.avatar ? this.avatar : "avatar.png";
  return `https://${process.env.API_HOST}:${process.env.API_PORT}/uploads/${avatar}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  console.log(this.password);
  try {
    console.log(this.password);
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = model("User", userSchema);
