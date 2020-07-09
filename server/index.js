const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const User = require("./models/User");
const { auth } = require("./middleware/auth");

mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
    role: req.user.role,
  });
});

app.post("/api/users/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
});

app.post("/api/user/login", async (req, res) => {
  try {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user)
        return res.json({
          loginSuccess: false,
          message: "Auth failed, email not found",
        });

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({ loginSucess: false, message: "Wrong password" });
      });

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }

        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
        });
      });
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
