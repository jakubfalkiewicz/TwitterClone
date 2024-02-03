const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true },
});

var autoPopulateFields = function (next) {
  try {
    this.populate({
      path: "user",
      select: "login",
    });
  } catch (err) {
    console.log(err.message);
  }
  next();
};

notificationSchema
  .pre("find", autoPopulateFields)
  .pre("findOne", autoPopulateFields);

module.exports = model("Notification", notificationSchema);
