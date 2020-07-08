const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://ryan:BIAtLlY62EGXIw4b@react-blog.ka5sh.mongodb.net/<dbname>?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(5000, (req, res) => {
  console.log("Server running on port 5000");
});
