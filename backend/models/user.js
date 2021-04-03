const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  balance: { type: Number, default: 0 }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);