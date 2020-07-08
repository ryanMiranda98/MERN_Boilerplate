const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: true },
  password: { type: String, minlength: 5 },
  lastName: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 }, // 0- user, 1- admin
  token: { type: String },
  tokenExpiration: { type: Number },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
