const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: true },
  password: { type: String, minlength: 5 },
  lastName: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 }, // 0- user, 1- admin
  token: { type: String },
  tokenExpiration: { type: Number },
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, async function (err, salt) {
      if (err) return next(err);
      await bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function (plainPassword, cb) {
  const user = this;
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.generateToken = function (cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), "secret");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

UserSchema.statics.findByToken = function (token, cb) {
  const user = this;
  jwt.verify(token, "secret", function (err, decode) {
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
