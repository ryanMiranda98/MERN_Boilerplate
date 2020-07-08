const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const User = require("./models/User");

mongoose
  .connect(config.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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
      error: err,
    });
  }
});

app.listen(5000, (req, res) => {
  console.log("Server running on port 5000");
});
