const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = app;
