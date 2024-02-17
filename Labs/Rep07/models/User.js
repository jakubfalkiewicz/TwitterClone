const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10; // You can adjust this based on your security requirements

const userSchema = new Schema({
  login: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: false, default: "" },
  admin: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
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

module.exports = model("User", userSchema);
