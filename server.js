require("dotenv").config();

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, console.log("MongoDB connected"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/baymax", (req, res) => {
  res.render("baymax");
});

app.get("/hiro", (req, res) => {
  res.render("hiro");
})

app.get("/microbots", (req, res) => {
  res.render("microbots");
})

app.get("/creatures", (req, res) => {
  res.render("creatures");
})

app.get("/mutiny", (req, res) => {
  res.render("game");
})

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
